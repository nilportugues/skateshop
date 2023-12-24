import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { type Order } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"

import { getUserEmail } from "@/lib/client/utils"
import { purchasesSearchParamsSchema } from "@/lib/server/params.validations"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { PurchasesDataTable } from "@/features/stripe/client/components/dashboard.datatable.purchases"
import { Shell } from "@/components/shells/shell"
import { countOrdersByEmailAndStore, findOrdersByEmailAndStore } from "@/features/stripe/server/db"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Purchases",
  description: "Manage your purchases",
}
interface PurchasesPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

function calculateOffset(fallbackPage: number, limit: number) {
  return fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
}

function calculatePageSizeLimit(per_page: string) {
  const perPageAsNumber = Number(per_page)
  const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
  return limit
}

function calculateFallbackPage(page: string) {
  const pageAsNumber = Number(page)
  const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
  return fallbackPage
}


export default async function PurchasesPage({ searchParams }: PurchasesPageProps) {
  const { page, per_page, sort, store, status } = purchasesSearchParamsSchema.parse(searchParams)

  const user = await currentUser()
  if (!user) {
    redirect("/signin")
  }

  const email = getUserEmail(user)

  const fallbackPage = calculateFallbackPage(page)
  const limit = calculatePageSizeLimit(per_page)
  const offset = calculateOffset(fallbackPage, limit)

  // Column and order to sort by
  const [column, order] = (sort?.split(".") as [
    keyof Order | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  const statuses = status ? status.split(".") : []

  // Transaction is used to ensure both queries are executed in a single transaction
  const [ items, count ] = await Promise.all([
    findOrdersByEmailAndStore({email, store, statuses, column, order, limit, offset}),
    countOrdersByEmailAndStore({email, store, statuses})
  ]);

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-purchases-header"
        aria-labelledby="dashboard-purchases-header-heading"
        separated
      >
        <PageHeaderHeading size="sm">Purchases</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your purchases
        </PageHeaderDescription>
      </PageHeader>
      <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <PurchasesDataTable items={items} count={count} limit={limit} />
      </React.Suspense>
    </Shell>
  )
}
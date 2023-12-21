import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { env } from "@/env.mjs"
import { getOrderCartLineItems } from "@/features/stripe/server/order.services"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { findStoryById } from "@/features/stores/server/db"
import { findOrderById } from "@/features/stripe/server/db"
import { OrderCard } from "@/features/stripe/client/components/dashboard.card.order"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Purchase",
  description: "View your purchase details",
}

interface PurchasePageProps {
  params: {
    purchaseId: string
  }
}

export default async function PurchasePage({ params }: PurchasePageProps) {
  // Using the purchaseId as the orderId in the sql query
  const orderId = Number(params.purchaseId)

  const order = await findOrderById({orderId})
  if (!order) {
    notFound()
  }

  const cartLineItems = await getOrderCartLineItems({
    items: String(order.items),
    storeId: order.storeId,
  })

  const store = await findStoryById({storeId: order.storeId});

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="purchase-page-header"
        aria-labelledby="purchase-page-header-heading"
      >
        <PageHeaderHeading size="sm">Purchase</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          View your purchase details
        </PageHeaderDescription>
      </PageHeader>


      <OrderCard {...{orderId, store, cartLineItems}} />

    </Shell>
  )
}

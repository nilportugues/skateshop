import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { env } from "@/env.mjs"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UpdateEmailPreferencesForm } from "@/features/email-preferences/client/components/dashboard/update-email-preferences-form"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { getEmailPreferencesByToken } from "@/features/email-preferences/server/db"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Email Preferences",
  description: "Manage your email preferences",
}

interface EmailPreferencesPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function EmailPreferencesPage({
  searchParams,
}: EmailPreferencesPageProps) {
  const token = typeof searchParams.token === "string" ? searchParams.token : ""

  const emailPreference = await getEmailPreferencesByToken({token})

  if (!emailPreference) {
    notFound()
  }

  return (
    <Shell variant="centered">
      <PageHeader title="Email Preferences" className="text-center" />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateEmailPreferencesForm emailPreference={emailPreference} />
        </CardContent>
      </Card>
    </Shell>
  )
}


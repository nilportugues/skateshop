import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";

export function BillingPageHeader() {
    return (
        <PageHeader
        id="billing-header"
        aria-labelledby="billing-header-heading"
        separated
      >
        <PageHeaderHeading size="sm">Billing</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your billing and subscription
        </PageHeaderDescription>
      </PageHeader>
    )
}
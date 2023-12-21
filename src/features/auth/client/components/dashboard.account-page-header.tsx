import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";

export function AccountPageHeader() {
    return   <PageHeader
    id="account-header"
    aria-labelledby="account-header-heading"
    separated
  >
    <PageHeaderHeading size="sm">Account</PageHeaderHeading>
    <PageHeaderDescription size="sm">
      Manage your account settings
    </PageHeaderDescription>
  </PageHeader>
}
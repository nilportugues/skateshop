
import { Shell } from "@/components/shells/shell"
import { LoadingBillingInfo } from "@/features/stripe/client/components/dashboard.billing-info"
import { BillingPageHeader } from "@/features/stripe/client/components/dashboard.billing-page-header"
import { LoadingSubscriptionPlans } from "@/features/stripe/client/components/dashboard.billing-subscription-plans"

export default function BillingLoading() {
  
  return (
    <Shell variant="sidebar" as="div">
      <BillingPageHeader />
      <LoadingBillingInfo/>
      <LoadingSubscriptionPlans />

    </Shell>
  )
}

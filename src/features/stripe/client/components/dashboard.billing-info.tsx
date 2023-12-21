import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/client/utils";
import { UserSubscriptionPlan } from "@/types";

export function BillingInfo({subscriptionPlan}: {subscriptionPlan: UserSubscriptionPlan | null}) {
    return <section
      id="billing-info"
      aria-labelledby="billing-info-heading"
      className="space-y-5"
    >
      <h2 className="text-xl font-semibold sm:text-2xl">Billing info</h2>
      <Card className="grid gap-4 p-6">
        <h3 className="text-lg font-semibold sm:text-xl">
          {subscriptionPlan?.name ?? "Ollie"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {!subscriptionPlan?.isSubscribed
            ? "Upgrade to create more stores and products."
            : subscriptionPlan.isCanceled
              ? "Your plan will be canceled on "
              : "Your plan renews on "}
          {subscriptionPlan?.stripeCurrentPeriodEnd
            ? `${formatDate(subscriptionPlan.stripeCurrentPeriodEnd)}.`
            : null}
        </p>
      </Card>
    </section>
  }

  export function LoadingBillingInfo () {
    return       <section className="space-y-5">
    <h2 className="text-xl font-semibold sm:text-2xl">Billing info</h2>
    <Card className="grid gap-4 p-6">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </Card>
  </section>
  }
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { storeSubscriptionPlans } from "@/features/stripe/config/subscriptions";
import { cn, formatPrice } from "@/lib/client/utils";
import { UserSubscriptionPlan } from "@/types";
import { CheckIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { ManageSubscriptionForm } from "./dashboard.form.manage-subscription";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionPlans({subscriptionPlan}: {subscriptionPlan: UserSubscriptionPlan | null}) {
    return <section
      id="subscription-plans"
      aria-labelledby="subscription-plans-heading"
      className="space-y-5 pb-2.5"
    >
      <h2 className="text-xl font-semibold sm:text-2xl">
        Subscription plans
      </h2>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {storeSubscriptionPlans.map((plan, i) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col",
              i === storeSubscriptionPlans.length - 1 &&
              "lg:col-span-2 xl:col-span-1",
              i === 1 && "border-primary shadow-md"
            )}
          >
            <CardHeader>
              <CardTitle className="line-clamp-1">{plan.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid flex-1 place-items-start gap-6">
              <div className="text-3xl font-bold">
                {formatPrice(plan.price, {
                  currency: "USD",
                })}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              {plan.id === "basic" ? (
                <Link
                  href="/dashboard/stores"
                  className={cn(
                    buttonVariants({
                      className: "w-full",
                    })
                  )}
                >
                  Get started
                  <span className="sr-only">Get started</span>
                </Link>
              ) : (
                <ManageSubscriptionForm
                  stripePriceId={plan.stripePriceId}
                  stripeCustomerId={subscriptionPlan?.stripeCustomerId}
                  stripeSubscriptionId={subscriptionPlan?.stripeSubscriptionId}
                  isSubscribed={subscriptionPlan?.isSubscribed ?? false}
                  isCurrentPlan={subscriptionPlan?.name === plan.name} />
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  }
  

  export function LoadingSubscriptionPlans() {
    return (
      <section className="space-y-5 pb-2.5">
        <h2 className="text-xl font-semibold sm:text-2xl">
          Subscription plans
        </h2>
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className={cn(
                "flex flex-col",
                i === 2 && "lg:col-span-2 xl:col-span-1"
              )}
            >
              <CardHeader>
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="grid flex-1 place-items-start gap-6">
                <Skeleton className="h-7 w-16" />
                <div className="w-full space-y-2">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Skeleton className="h-6 w-1/2" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    )
  }
import { formatId, formatPrice } from "@/lib/client/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { CartLineItem } from "@/types"

export function OrderCard({orderId, store, cartLineItems}: {orderId: number, store?: {name: string}, cartLineItems: CartLineItem[]}) {
    return <Card>
      <CardHeader className="space-y-1">
        <CardTitle as="h2" className="text-2xl">
          Order {formatId(orderId)}
        </CardTitle>
        <CardDescription>{store?.name ?? "Unknown store"}</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full flex-col space-y-2.5">
        {cartLineItems.map((item) => (
          <Link
            aria-label={`View ${item.name}`}
            key={item.id}
            href={`/product/${item.id}`}
            className="rounded-md bg-muted px-4 py-2.5 hover:bg-muted/70"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1 self-start">
                  <span className="line-clamp-1 text-sm font-medium">
                    {item.name}
                  </span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    Qty {item.quantity}
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-1 font-medium">
                <span className="ml-auto line-clamp-1 text-sm">
                  {formatPrice(
                    (Number(item.price) * item.quantity).toFixed(2)
                  )}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {formatPrice(item.price)} each
                </span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  }
  
  
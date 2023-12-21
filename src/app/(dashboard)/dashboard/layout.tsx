import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"
import DashboardLayout from "@/components/dashboard.layout"

export default async function Layout({
  children,
}: React.PropsWithChildren) {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  return (<DashboardLayout user={user}>{children}</DashboardLayout>)
}

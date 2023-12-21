import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"
import DashboardLayout from "@/features/dashboard/client/dashboard-layout"

export default async function Layout({
  children,
}: React.PropsWithChildren) {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  return (<DashboardLayout user={user}>{children}</DashboardLayout>)
}

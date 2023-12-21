import { Shell } from "@/components/shells/shell"
import { AccountPageHeader } from "@/features/auth/client/components/dashboard.account-page-header"
import { LoadingUserProfile } from "@/features/auth/client/components/dashboard.user-profile"

export default function AccountLoading() {
  return (
    <Shell variant="sidebar">
      <AccountPageHeader />
      <LoadingUserProfile />
    </Shell>
  )
}

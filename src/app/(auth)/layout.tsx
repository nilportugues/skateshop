import AuthLayout from "@/features/auth/client/auth-layout"

export default function Layout({ children }: React.PropsWithChildren) {
  return <AuthLayout>{children}</AuthLayout>
}
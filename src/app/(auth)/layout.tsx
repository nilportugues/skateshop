import AuthLayout from '@/features/auth/client/components/layout.auth';

export default function Layout({ children }: React.PropsWithChildren) {
    return <AuthLayout>{children}</AuthLayout>;
}

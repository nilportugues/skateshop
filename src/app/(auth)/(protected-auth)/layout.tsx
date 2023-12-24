import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function ProtectedAuthLayout({
    children,
}: React.PropsWithChildren) {
    const user = await currentUser();

    if (user) {
        redirect('/');
    }

    return <>{children}</>;
}

import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function CheckoutLayout({
    children,
}: React.PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        redirect('/signin');
    }

    return <main>{children}</main>;
}

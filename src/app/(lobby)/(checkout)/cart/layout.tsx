import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { SiteHeader } from '@/components/layouts/site-header';

export default async function CartLayout({
    children,
}: React.PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        redirect('/signin');
    }

    return (
        <div className="relative flex min-h-screen flex-col">
            <SiteHeader user={user} />
            <main className="flex-1">{children}</main>
        </div>
    );
}

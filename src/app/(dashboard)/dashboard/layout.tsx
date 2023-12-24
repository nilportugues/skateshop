import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import DashboardLayout from '@/components/dashboard/dashboard-layout';

export default async function Layout({ children }: React.PropsWithChildren) {
    const user = await currentUser();

    if (!user) {
        redirect('/signin');
    }

    return <DashboardLayout user={user}>{children}</DashboardLayout>;
}

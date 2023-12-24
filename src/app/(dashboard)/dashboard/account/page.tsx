import type { Metadata } from 'next';

import { AccountPageHeader } from '@/features/auth/client/components/dashboard.account-page-header';
import { UserProfile } from '@/features/auth/client/components/dashboard.user-profile';

import { Shell } from '@/components/shells/shell';
import { env } from '@/env.mjs';

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: 'Account',
    description: 'Manage your account settings',
};

export default function AccountPage() {
    return (
        <Shell variant="sidebar">
            <AccountPageHeader />
            <UserProfile />
        </Shell>
    );
}

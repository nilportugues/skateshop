import { type Metadata } from 'next';

import { ResetPasswordStep2Form } from '@/features/auth/client/components/form.reset-password-step2';

import { Shell } from '@/components/shells/shell';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { env } from '@/env.mjs';

export const metadata: Metadata = {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: 'Reset Password',
    description: 'Enter your email to reset your password',
};

export default function ResetPasswordStep2Page() {
    return (
        <Shell className="max-w-lg">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Reset password</CardTitle>
                    <CardDescription>
                        Enter your email address and we will send you a
                        verification code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordStep2Form />
                </CardContent>
            </Card>
        </Shell>
    );
}

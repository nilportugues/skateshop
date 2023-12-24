'use client';

import { cn } from '@/lib/client/utils';

import { Button, type ButtonProps } from '@/components/ui/button';

interface ClientButtonProps extends ButtonProps {}

export function ClientButton({ className, ...props }: ClientButtonProps) {
    return <Button className={cn(className)} {...props}></Button>;
}

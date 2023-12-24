'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/libs/client/utils';

interface ClientButtonProps extends ButtonProps {}

export function ClientButton({ className, ...props }: ClientButtonProps) {
    return <Button className={cn(className)} {...props}></Button>;
}

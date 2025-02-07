'use client';

import Image from 'next/image';

import { cn } from '@/libs/client/utils';

interface MdxImageProps extends React.ComponentProps<typeof Image> {}

export function MdxImage({ className, ...props }: MdxImageProps) {
    return (
        <Image
            {...props}
            alt={props.alt ?? 'Uncaptioned'}
            className={cn(className)}
        />
    );
}

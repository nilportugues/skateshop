import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from '@/components/page-header';

export function PageHeaderBlock({
    title,
    description,
    size,
    children,
}: {
    title: string;
    description?: string;
    size?: 'sm' | 'lg';
    children?: React.ReactNode;
}) {
    function Wrapper({
        wrap,
        children,
    }: {
        wrap: boolean;
        children: React.ReactNode;
    }) {
        return wrap ? (
            <div className="flex space-x-4">{children}</div>
        ) : (
            <>{children}</>
        );
    }

    return (
        <PageHeader
            id={`${title.replaceAll(' ', '-').toLocaleLowerCase()}-page-header`}
            aria-labelledby={`${title
                .replaceAll(' ', '-')
                .toLocaleLowerCase()}-page-header-heading`}
        >
            <Wrapper wrap={Boolean(children)}>
                <PageHeaderHeading
                    size={size}
                    className={children ? 'flex-1' : undefined}
                >
                    {title}
                </PageHeaderHeading>
                {children}
            </Wrapper>

            {description && (
                <PageHeaderDescription size={size}>
                    {description}
                </PageHeaderDescription>
            )}
        </PageHeader>
    );
}

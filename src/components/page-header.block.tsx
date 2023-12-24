import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from '@/components/page-header';

export function PageHeaderBlock({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <PageHeader>
            <PageHeaderHeading>{title}</PageHeaderHeading>
            {description && (
                <PageHeaderDescription>{description}</PageHeaderDescription>
            )}
        </PageHeader>
    );
}

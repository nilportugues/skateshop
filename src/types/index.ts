import { type FileWithPath } from 'react-dropzone';
import type Stripe from 'stripe';
import { type z } from 'zod';

import { type userPrivateMetadataSchema } from '@/features/auth/constants';

import type {
    cartItemSchema,
    cartLineItemSchema,
    checkoutItemSchema,
} from '@/features/cart/cart.validation';

import type { Icons } from '@/components/icons';
import type { Product, Store } from '@/libs/server/db/schema';

export interface NavItem {
    title: string;
    href?: string;
    disabled?: boolean;
    external?: boolean;
    icon?: keyof typeof Icons;
    label?: string;
    description?: string;
}

export interface NavItemWithChildren extends NavItem {
    items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
    items?: NavItemWithChildren[];
}

export interface FooterItem {
    title: string;
    items: {
        title: string;
        href: string;
        external?: boolean;
    }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type UserRole = z.infer<typeof userPrivateMetadataSchema.shape.role>;

export interface Option {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export type FileWithPreview = FileWithPath & {
    preview: string;
};

export interface StoredFile {
    id: string;
    name: string;
    url: string;
}

export interface DataTableSearchableColumn<TData> {
    id: keyof TData;
    title: string;
}

export interface DataTableFilterableColumn<TData>
    extends DataTableSearchableColumn<TData> {
    options: Option[];
}

export interface Category {
    title: Product['category'];
    image: string;
    icon: React.ComponentType<{ className?: string }>;
    subcategories: Subcategory[];
}

export interface Subcategory {
    title: string;
    description?: string;
    image?: string;
    slug: string;
}

export interface CuratedStore {
    id: Store['id'];
    name: Store['name'];
    description?: Store['description'];
    stripeAccountId?: Store['stripeAccountId'];
    productCount?: number;
}

export type CartItem = z.infer<typeof cartItemSchema>;

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;

export type CartLineItem = z.infer<typeof cartLineItemSchema>;

export type StripePaymentStatus = Stripe.PaymentIntent.Status;

export interface SubscriptionPlan {
    id: 'basic' | 'standard' | 'pro';
    name: string;
    description: string;
    features: string[];
    stripePriceId: string;
    price: number;
}

export interface UserSubscriptionPlan extends SubscriptionPlan {
    stripeSubscriptionId?: string | null;
    stripeCurrentPeriodEnd?: string | null;
    stripeCustomerId?: string | null;
    isSubscribed: boolean;
    isCanceled: boolean;
    isActive: boolean;
}

import { z } from 'zod';

// --- Branding ---
export const BrandingSchema = z.object({
    restName: z.string().min(1).max(100),
    restBio: z.string().max(300).default(''),
    restCover: z.string().default(''),
    restLogo: z.string().default(''),
    brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#7A55FD'),
});
export type Branding = z.infer<typeof BrandingSchema>;

// --- Subcategory ---
export const SubcategorySchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(100),
});
export type Subcategory = z.infer<typeof SubcategorySchema>;

// --- Category ---
export const CategorySchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(100),
    subcategories: z.array(SubcategorySchema).default([]),
});
export type Category = z.infer<typeof CategorySchema>;

// --- Product ---
export const ProductSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string().min(1).max(200),
    desc: z.string().max(500).default(''),
    price: z.string().default('R$ 0,00'),
    image: z.string().default(''),
    categoryId: z.string().optional(),
    subcategoryId: z.string().optional(),
    type: z.enum(['regular', 'pizza', 'wine']).optional(),
    country: z.string().optional(),
    countryFlag: z.string().optional(),
    year: z.string().optional(),
    facts: z.record(z.string(), z.string()).optional(),
});
export type Product = z.infer<typeof ProductSchema>;

// --- Cart Item ---
export const CartItemSchema = ProductSchema.extend({
    qty: z.number().int().min(1),
    obs: z.string().default(''),
});
export type CartItem = z.infer<typeof CartItemSchema>;

// --- Order ---
export const OrderSchema = z.object({
    id: z.string().startsWith('#'),
    time: z.string(),
    status: z.enum(['waiting', 'preparing', 'ready', 'delivered']),
    statusLabel: z.string(),
    items: z.array(CartItemSchema),
    timestamp: z.number(),
});
export type Order = z.infer<typeof OrderSchema>;

// --- Safe parsers (não lançam exceção, retornam null) ---
export function safeParseBranding(data: unknown): Branding | null {
    const result = BrandingSchema.safeParse(data);
    return result.success ? result.data : null;
}

export function safeParseCategories(data: unknown): Category[] | null {
    const result = z.array(CategorySchema).safeParse(data);
    return result.success ? result.data : null;
}

export function safeParseProducts(data: unknown): Product[] | null {
    const result = z.array(ProductSchema).safeParse(data);
    return result.success ? result.data : null;
}

export function safeParseCart(data: unknown): CartItem[] | null {
    const result = z.array(CartItemSchema).safeParse(data);
    return result.success ? result.data : null;
}

export function safeParseOrders(data: unknown): Order[] | null {
    const result = z.array(OrderSchema).safeParse(data);
    return result.success ? result.data : null;
}

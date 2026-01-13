import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'menux-bucket';
const BASE_URL = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com`;

/**
 * Check if a string is a base64 encoded image
 */
export function isBase64Image(str: string | null | undefined): boolean {
    if (!str) return false;
    return str.startsWith('data:image/');
}

/**
 * Extract mime type from base64 string
 */
function getMimeType(base64String: string): string {
    const match = base64String.match(/data:([^;]+);/);
    return match ? match[1] : 'image/jpeg';
}

/**
 * Get file extension from mime type
 */
function getExtensionFromMime(mimeType: string): string {
    const mapping: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
    };
    return mapping[mimeType] || 'jpg';
}

/**
 * Upload a base64 image to S3
 * @param base64String - The base64 encoded image string (with data URI prefix)
 * @param folder - The folder path in the bucket (e.g., 'menu-items', 'restaurants/logos')
 * @returns The S3 key (path) of the uploaded file
 */
export async function uploadBase64ToS3(base64String: string, folder: string): Promise<string> {
    const mimeType = getMimeType(base64String);
    const extension = getExtensionFromMime(mimeType);

    // Remove data URI prefix to get raw base64
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const fileName = `${uuidv4()}.${extension}`;
    const key = `${folder}/${fileName}`;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        ACL: 'public-read',
    });

    await s3Client.send(command);

    return key;
}

/**
 * Delete an object from S3
 * @param key - The S3 key (path) of the object to delete
 */
export async function deleteFromS3(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
}

/**
 * Get the public URL for an S3 object
 * @param key - The S3 key (path) of the object
 * @returns The full public URL
 */
export function getS3PublicUrl(key: string | null | undefined): string | null {
    if (!key) return null;
    // If it's already a full URL, return as-is
    if (key.startsWith('http://') || key.startsWith('https://')) {
        return key;
    }
    return `${BASE_URL}/${key}`;
}

/**
 * Process an image field - upload to S3 if base64, return key or existing value
 * @param imageValue - The image value (could be base64, S3 key, or URL)
 * @param folder - The folder to upload to if it's base64
 * @returns The S3 key or existing value
 */
export async function processImageField(
    imageValue: string | null | undefined,
    folder: string
): Promise<string | null> {
    if (!imageValue) return null;

    if (isBase64Image(imageValue)) {
        return await uploadBase64ToS3(imageValue, folder);
    }

    // If it's already a URL or key, return as-is
    return imageValue;
}

/**
 * Transform a MenuItem entity to include full S3 URL for imageUrl
 */
export function transformMenuItemUrls<T extends { imageUrl?: string | null }>(item: T): T {
    if (item && item.imageUrl) {
        item.imageUrl = getS3PublicUrl(item.imageUrl);
    }
    return item;
}

/**
 * Transform a Restaurant entity to include full S3 URLs for logoUrl and headerUrl
 */
export function transformRestaurantUrls<T extends { logoUrl?: string | null; headerUrl?: string | null }>(restaurant: T): T {
    if (restaurant) {
        if (restaurant.logoUrl) restaurant.logoUrl = getS3PublicUrl(restaurant.logoUrl);
        if (restaurant.headerUrl) restaurant.headerUrl = getS3PublicUrl(restaurant.headerUrl);
    }
    return restaurant;
}

/**
 * Transform a User or Waiter entity to include full S3 URL for avatarUrl
 */
export function transformAvatarUrl<T extends { avatarUrl?: string | null }>(entity: T): T {
    if (entity && entity.avatarUrl) {
        entity.avatarUrl = getS3PublicUrl(entity.avatarUrl);
    }
    return entity;
}

/**
 * Transform an array of entities
 */
export function transformArrayUrls<T>(
    items: T[],
    transformer: (item: T) => T
): T[] {
    return items.map(transformer);
}

export { s3Client, BUCKET_NAME, BASE_URL };

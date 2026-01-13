/**
 * Migration Script: Migrate existing base64 images to S3
 * 
 * This script finds all database records with base64 images and:
 * 1. Uploads them to S3
 * 2. Updates the database field with the S3 key
 * 
 * Run with: npx ts-node -r tsconfig-paths/register src/infrastructure/database/scripts/migrate-images-to-s3.ts
 */

import 'reflect-metadata';
import { AppDataSource } from '../typeorm/data-source';
import { MenuItem } from '@domain/entities/MenuItem';
import { Restaurant } from '@domain/entities/Restaurant';
import { Waiter } from '@domain/entities/Waiter';
import { User } from '@domain/entities/User';
import { isBase64Image, uploadBase64ToS3 } from '@infrastructure/storage/S3Service';

async function migrateImages() {
    console.log('🚀 Starting image migration to S3...');

    await AppDataSource.initialize();
    console.log('✅ Database connected');

    let totalMigrated = 0;

    // 1. Migrate MenuItem.imageUrl
    console.log('\n📦 Migrating MenuItem images...');
    const menuItemRepo = AppDataSource.getRepository(MenuItem);
    const menuItems = await menuItemRepo.find();

    for (const item of menuItems) {
        if (isBase64Image(item.imageUrl)) {
            try {
                const key = await uploadBase64ToS3(item.imageUrl!, 'menu-items');
                await menuItemRepo.update(item.id, { imageUrl: key });
                console.log(`  ✓ MenuItem ${item.id}: ${item.name}`);
                totalMigrated++;
            } catch (error) {
                console.error(`  ✗ MenuItem ${item.id}: ${error}`);
            }
        }
    }

    // 2. Migrate Restaurant.logoUrl and headerUrl
    console.log('\n🏪 Migrating Restaurant images...');
    const restaurantRepo = AppDataSource.getRepository(Restaurant);
    const restaurants = await restaurantRepo.find();

    for (const restaurant of restaurants) {
        const updates: Partial<Restaurant> = {};

        if (isBase64Image(restaurant.logoUrl)) {
            try {
                updates.logoUrl = await uploadBase64ToS3(restaurant.logoUrl!, 'restaurants/logos');
                console.log(`  ✓ Restaurant ${restaurant.id} logoUrl: ${restaurant.name}`);
                totalMigrated++;
            } catch (error) {
                console.error(`  ✗ Restaurant ${restaurant.id} logoUrl: ${error}`);
            }
        }

        if (isBase64Image(restaurant.headerUrl)) {
            try {
                updates.headerUrl = await uploadBase64ToS3(restaurant.headerUrl!, 'restaurants/headers');
                console.log(`  ✓ Restaurant ${restaurant.id} headerUrl: ${restaurant.name}`);
                totalMigrated++;
            } catch (error) {
                console.error(`  ✗ Restaurant ${restaurant.id} headerUrl: ${error}`);
            }
        }

        if (Object.keys(updates).length > 0) {
            await restaurantRepo.update(restaurant.id, updates);
        }
    }

    // 3. Migrate Waiter.avatarUrl
    console.log('\n👨‍🍳 Migrating Waiter images...');
    const waiterRepo = AppDataSource.getRepository(Waiter);
    const waiters = await waiterRepo.find();

    for (const waiter of waiters) {
        if (isBase64Image(waiter.avatarUrl)) {
            try {
                const key = await uploadBase64ToS3(waiter.avatarUrl!, 'waiters');
                await waiterRepo.update(waiter.id, { avatarUrl: key });
                console.log(`  ✓ Waiter ${waiter.id}: ${waiter.name}`);
                totalMigrated++;
            } catch (error) {
                console.error(`  ✗ Waiter ${waiter.id}: ${error}`);
            }
        }
    }

    // 4. Migrate User.avatarUrl
    console.log('\n👤 Migrating User images...');
    const userRepo = AppDataSource.getRepository(User);
    const users = await userRepo.find();

    for (const user of users) {
        if (isBase64Image(user.avatarUrl)) {
            try {
                const key = await uploadBase64ToS3(user.avatarUrl!, 'users');
                await userRepo.update(user.id, { avatarUrl: key });
                console.log(`  ✓ User ${user.id}: ${user.name}`);
                totalMigrated++;
            } catch (error) {
                console.error(`  ✗ User ${user.id}: ${error}`);
            }
        }
    }

    console.log(`\n✅ Migration complete! Total images migrated: ${totalMigrated}`);

    await AppDataSource.destroy();
    process.exit(0);
}

migrateImages().catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
});

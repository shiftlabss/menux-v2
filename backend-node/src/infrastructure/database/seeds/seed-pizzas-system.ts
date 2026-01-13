import 'reflect-metadata';
import { IsNull } from 'typeorm';
import { AppDataSource } from '../typeorm/data-source';
import { Restaurant } from '../../../domain/entities/Restaurant';
import { Category } from '../../../domain/entities/Category';
import { MenuItem } from '../../../domain/entities/MenuItem';
import { Menu } from '../../../domain/entities/Menu';

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log('📦 Database initialized');

        const restaurantRepo = AppDataSource.getRepository(Restaurant);
        const categoryRepo = AppDataSource.getRepository(Category);
        const itemRepo = AppDataSource.getRepository(MenuItem);
        const menuRepo = AppDataSource.getRepository(Menu);

        const restaurant = await restaurantRepo.findOne({ where: { slug: 'menux-default' } });

        if (!restaurant) {
            console.error('❌ Default restaurant not found. Please run initial seed first.');
            return;
        }

        console.log(`Using restaurant: ${restaurant.id}`);

        // Helper
        const ensureCategory = async (name: string, parentId: string | null = null) => {
            let cat = await categoryRepo.findOne({
                where: {
                    name: name,
                    restaurantId: restaurant.id,
                    pai: parentId ? parentId : IsNull()
                }
            });

            if (!cat) {
                cat = categoryRepo.create({
                    name,
                    isActive: true,
                    restaurantId: restaurant.id,
                    pai: parentId || null
                });
                await categoryRepo.save(cat);
                console.log(`✅ Created Category: ${name}`);
            }
            return cat;
        };

        // 1. Root Category "Pizzas"
        const pizzasCat = await ensureCategory('Pizzas');

        // 2. Subcategories
        await ensureCategory('Tradicionais', pizzasCat.id);
        await ensureCategory('Especiais', pizzasCat.id);
        await ensureCategory('Doces', pizzasCat.id);

        // 3. System Config Categories
        const sysRoot = await ensureCategory('System');

        const crustsCat = await ensureCategory('Pizza Crusts', sysRoot.id);
        const doughsCat = await ensureCategory('Pizza Doughs', sysRoot.id);
        await ensureCategory('Pizza Addons', sysRoot.id);

        // Default Crusts
        const createOption = async (name: string, catId: string, price: number = 0) => {
            let item = await itemRepo.findOne({ where: { name, categoryId: catId } });
            if (!item) {
                const menu = await menuRepo.findOne({ where: { restaurantId: restaurant.id } });

                if (menu) {
                    item = itemRepo.create({
                        name,
                        price,
                        categoryId: catId,
                        isActive: true,
                        description: 'System Option',
                        menuId: menu.id
                    });
                    // item.menu = menu; // No need if menuId is set and we save? relations need object sometimes.
                    // But let's check MenuItem entity. It has @ManyToOne.
                    // It expects 'menu' property for cascade validation usually.
                    item.menu = menu;

                    await itemRepo.save(item);
                    console.log(`   🔸 Created Option: ${name}`);
                } else {
                    console.warn('   ⚠️ No menu found, skipping option creation');
                }
            }
        };

        await createOption('Tradicional', crustsCat.id, 0);
        await createOption('Recheada com Catupiry', crustsCat.id, 12);

        await createOption('Tradicional', doughsCat.id, 0);
        await createOption('Integral', doughsCat.id, 5);

    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();

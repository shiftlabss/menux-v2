import 'reflect-metadata';
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
            console.error('❌ Default restaurant not found.');
            return;
        }

        const menu = await menuRepo.findOne({ where: { restaurantId: restaurant.id } });
        if (!menu) {
            console.error('❌ Default menu not found.');
            return;
        }

        console.log(`Using restaurant: ${restaurant.id}`);

        // Helper
        const ensureCategory = async (name: string, isComposition: boolean, order: number) => {
            let cat = await categoryRepo.findOne({
                where: {
                    name: name,
                    restaurantId: restaurant.id,
                    isComposition: isComposition
                }
            });

            if (!cat) {
                cat = categoryRepo.create({
                    name,
                    isActive: true,
                    isComposition,
                    restaurantId: restaurant.id,
                    order,
                    isVisible: false // Usually config cats are hidden from main menu list
                });
                await categoryRepo.save(cat);
                console.log(`✅ Created Category: ${name}`);
            } else {
                // Ensure isComposition is true if found
                if (!cat.isComposition) {
                    cat.isComposition = true;
                    await categoryRepo.save(cat);
                }
            }
            return cat;
        };

        const ensureItem = async (name: string, price: number, cat: Category, data: any = {}) => {
            let item = await itemRepo.findOne({ where: { name, categoryId: cat.id } });
            if (!item) {
                const newItem = itemRepo.create({
                    name,
                    price,
                    categoryId: cat.id,
                    isActive: true,
                    menuId: menu.id,
                    ...data
                }) as unknown as MenuItem;
                await itemRepo.save(newItem);
                item = newItem;
                console.log(`   🔸 Created Item: ${name}`);
            }
            return item!;
        };

        // 1. Create Composition Categories (Order matches requested steps)
        // Order: Massa, Tamanho*, Sabores, Borda, Adicionais
        // *Tamanho is separate (handled by modal logic or specific group), but we'll focus on others.
        // We will create these as Composition Groups.

        const massasCat = await ensureCategory('Escolha sua Massa', true, 1);
        const saboresCat = await ensureCategory('Escolha os Sabores', true, 2);
        const bordasCat = await ensureCategory('Borda Recheada', true, 3);
        const adicionaisCat = await ensureCategory('Adicionais', true, 4);

        // 2. Create Options
        // Massas
        const m1 = await ensureItem('Tradicional', 0, massasCat, { code: 'm1' });
        const m2 = await ensureItem('Integral', 5.00, massasCat, { code: 'm2' });
        const m3 = await ensureItem('Sem Glúten', 8.00, massasCat, { code: 'm3' });

        // Sabores
        const s1 = await ensureItem('Calabresa', 0, saboresCat, { code: 's1' });
        const s2 = await ensureItem('Quatro Queijos', 2.50, saboresCat, { code: 's2' });
        const s3 = await ensureItem('Frango com Catupiry', 0, saboresCat, { code: 's3' });
        const s4 = await ensureItem('Portuguesa', 3.00, saboresCat, { code: 's4' });

        // Bordas
        const b1 = await ensureItem('Catupiry', 7.00, bordasCat, { code: 'b1' });
        const b2 = await ensureItem('Cheddar', 7.00, bordasCat, { code: 'b2' });
        const b3 = await ensureItem('Chocolate', 10.00, bordasCat, { code: 'b3' });

        // Adicionais
        const a1 = await ensureItem('Bacon Extra', 4.50, adicionaisCat, { code: 'a1' });
        const a2 = await ensureItem('Rúcula', 3.00, adicionaisCat, { code: 'a2' });
        const a3 = await ensureItem('Azeitonas Pretas', 2.00, adicionaisCat, { code: 'a3' });


        // 3. Create the Pizza Item with Configuration
        // Find "Tradicionais" subcategory to put the pizza in
        let pizzaCat = await categoryRepo.findOne({ where: { name: 'Tradicionais', restaurantId: restaurant.id } });
        if (!pizzaCat) {
            // Fallback to "Pizzas"
            pizzaCat = await categoryRepo.findOne({ where: { name: 'Pizzas', restaurantId: restaurant.id } });
        }

        if (pizzaCat) {
            const pizzaName = 'Monte sua Pizza';
            let pizzaHandler = await itemRepo.findOne({ where: { name: pizzaName } });

            const config = {
                id: "pizza-custom-001",
                sort_order: ["massa", "tamanho", "sabores", "borda", "adicionais"],
                option_groups: [
                    {
                        id: massasCat.id,
                        name: massasCat.name,
                        min_selected: 1,
                        max_selected: 1,
                        options: [
                            { id: m1.id, name: m1.name, extra_price: Number(m1.price) },
                            { id: m2.id, name: m2.name, extra_price: Number(m2.price) },
                            { id: m3.id, name: m3.name, extra_price: Number(m3.price) }
                        ]
                    },
                    {
                        id: "tamanho",
                        name: "Tamanho da Pizza",
                        min_selected: 1,
                        max_selected: 1,
                        options: [
                            { id: "t1", name: "Pequena", extra_price: 30.00, max_flavors: 2 },
                            { id: "t2", name: "Média", extra_price: 45.00, max_flavors: 3 },
                            { id: "t3", name: "Grande", extra_price: 60.00, max_flavors: 4 }
                        ]
                    },
                    {
                        id: saboresCat.id,
                        name: saboresCat.name,
                        description: "Selecione até o limite do tamanho escolhido",
                        min_selected: 1,
                        max_selected_dynamic: "tamanho.max_flavors",
                        options: [
                            { id: s1.id, name: s1.name, extra_price: Number(s1.price) },
                            { id: s2.id, name: s2.name, extra_price: Number(s2.price) },
                            { id: s3.id, name: s3.name, extra_price: Number(s3.price) },
                            { id: s4.id, name: s4.name, extra_price: Number(s4.price) }
                        ]
                    },
                    {
                        id: bordasCat.id,
                        name: bordasCat.name,
                        min_selected: 0,
                        max_selected: 1,
                        options: [
                            { id: b1.id, name: b1.name, extra_price: Number(b1.price) },
                            { id: b2.id, name: b2.name, extra_price: Number(b2.price) },
                            { id: b3.id, name: b3.name, extra_price: Number(b3.price) }
                        ]
                    },
                    {
                        id: adicionaisCat.id,
                        name: adicionaisCat.name,
                        min_selected: 0,
                        max_selected: 10,
                        options: [
                            { id: a1.id, name: a1.name, extra_price: Number(a1.price) },
                            { id: a2.id, name: a2.name, extra_price: Number(a2.price) },
                            { id: a3.id, name: a3.name, extra_price: Number(a3.price) }
                        ]
                    }
                ]
            };

            if (!pizzaHandler) {
                pizzaHandler = itemRepo.create({
                    name: pizzaName,
                    price: 0, // Base price is 0
                    categoryId: pizzaCat.id,
                    menuId: menu.id,
                    isActive: true,
                    code: 'pizza-custom-001',
                    menuType: 'PIZZA',
                    optionsConfig: config,
                    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2670&auto=format&fit=crop'
                });
                await itemRepo.save(pizzaHandler);
                console.log(`✅ Created Pizza Item: ${pizzaName}`);
            } else {
                // Update config
                pizzaHandler.optionsConfig = config;
                pizzaHandler.menuType = 'PIZZA';
                await itemRepo.save(pizzaHandler);
                console.log(`✅ Updated Pizza Item: ${pizzaName}`);
            }
        }

    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();

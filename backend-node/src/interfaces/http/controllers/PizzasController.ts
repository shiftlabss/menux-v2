import { Request, Response } from 'express';
import { AppDataSource } from '@infrastructure/database/typeorm/data-source';
import { Category } from '@domain/entities/Category';
import { MenuItem } from '@domain/entities/MenuItem';
import { Menu } from '@domain/entities/Menu';
import { TypeOrmSystemParameterRepository } from '@infrastructure/repositories/TypeOrmSystemParameterRepository';

export class PizzasController {
    private categoryRepository = AppDataSource.getRepository(Category);
    private systemParameterRepository = new TypeOrmSystemParameterRepository();

    // GET /pizzas
    public index = async (req: Request, res: Response) => {
        const systemParams = await this.systemParameterRepository.findByRestaurantId(req.user.restaurantId);
        const pizzaCategoryId = systemParams?.pizzaCategoryId;

        if (!pizzaCategoryId) {
            return res.json([]);
        }

        const pizzasCat = await this.categoryRepository.findOne({
            where: { id: pizzaCategoryId }
        });

        if (!pizzasCat) {
            return res.json([]);
        }

        // 2. Find subcategories
        const subCategories = await this.categoryRepository.find({
            where: {
                pai: pizzasCat.id
            }
        });

        const subCategoryIds = subCategories.map(c => c.id);

        // 3. Find items in those subcategories OR directly in the root pizza category
        const itemRepo = AppDataSource.getRepository(MenuItem);

        const allCategoryIds = [...subCategoryIds, pizzaCategoryId];

        let query = itemRepo.createQueryBuilder('item')
            .where('item.categoryId IN (:...ids)', { ids: allCategoryIds })
            .andWhere('item.isActive = :isActive', { isActive: true });

        const items = await query.getMany();

        return res.json(items);
    }

    // GET /pizzas/categories
    public listCategories = async (req: Request, res: Response) => {
        const systemParams = await this.systemParameterRepository.findByRestaurantId(req.user.restaurantId);
        const pizzaCategoryId = systemParams?.pizzaCategoryId;

        if (!pizzaCategoryId) {
            return res.json([]);
        }

        const pizzasCat = await this.categoryRepository.findOne({
            where: { id: pizzaCategoryId }
        });

        if (!pizzasCat) {
            return res.json([]);
        }

        const subCategories = await this.categoryRepository.find({
            where: {
                pai: pizzasCat.id
            },
            relations: ['subcategories']
        });

        return res.json(subCategories);
    }

    /**
     * @swagger
     * /pizzas:
     *   post:
     *     summary: Create or Update a Pizza
     *     tags: [Pizzas]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               category_id:
     *                 type: string
     *                 format: uuid
     *               price:
     *                 type: number
     *               options_config:
     *                 type: object
     *     responses:
     *       200:
     *         description: The created pizza item
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MenuItemResponse'
     */
    public store = async (req: Request, res: Response) => {
        const data = req.body;
        const itemRepo = AppDataSource.getRepository(MenuItem);

        let item;
        if (data.id) {
            item = await itemRepo.findOne({ where: { id: data.id } });
        }

        if (!item) {
            const menu = await AppDataSource.getRepository(Menu).findOne({ where: { restaurantId: req.user.restaurantId } });
            if (!menu) return res.status(404).json({ error: 'Menu not found' });

            item = itemRepo.create();
            item.menu = menu;

            // Auto-assign category if missing and it's a pizza
            if (!data.category_id) {
                const systemParams = await this.systemParameterRepository.findByRestaurantId(req.user.restaurantId);
                if (systemParams?.pizzaCategoryId) {
                    item.categoryId = systemParams.pizzaCategoryId;
                }
            }
        }

        if (data.category_id) {
            item.categoryId = data.category_id;
        }

        item.name = data.name;
        item.imageUrl = data.photo_url;
        item.isActive = data.is_active;
        item.price = data.price;
        item.optionsConfig = data.builder_config || data.options_config;

        if (data.description) item.description = data.description;

        await itemRepo.save(item);
        return res.json(item);
    }

    public toggleStatus = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { is_active } = req.body;

        const itemRepo = AppDataSource.getRepository(MenuItem);
        const item = await itemRepo.findOne({ where: { id } });

        if (!item) {
            return res.status(404).json({ message: 'Pizza not found' });
        }

        item.isActive = is_active;
        await itemRepo.save(item);

        return res.json(item);
    }

    // --- SETTINGS ---

    private async getSystemItems(req: Request, categorySystemId: string) {
        const nameMap: Record<string, string> = {
            'sys_pizza_crusts': 'Borda',
            'sys_pizza_doughs': 'Tipo de Massa',
            'sys_pizza_addons': 'Adicionais'
        };

        const catName = nameMap[categorySystemId];
        if (!catName) return [];

        const cat = await this.categoryRepository.findOne({
            where: {
                restaurantId: req.user.restaurantId,
                name: catName
            }
        });

        if (!cat) return [];

        const items = await AppDataSource.getRepository(MenuItem).find({
            where: { categoryId: cat.id }
        });

        return items.map(i => {
            const priceVal = i.price ? Number(i.price) : 0;
            return {
                id: i.id,
                name: i.name,
                price: priceVal,
                price_add: {
                    P: priceVal,
                    M: priceVal,
                    G: priceVal,
                    F: priceVal
                },
                enabled: i.isActive
            };
        });
    }

    public listCrusts = async (req: Request, res: Response) => {
        const items = await this.getSystemItems(req, 'sys_pizza_crusts');
        return res.json(items);
    }

    public createCrust = async (req: Request, res: Response) => {
        return this.saveSystemItem(req, res, 'sys_pizza_crusts');
    }
    public updateCrust = async (req: Request, res: Response) => {
        return this.saveSystemItem(req, res, 'sys_pizza_crusts', req.params.id);
    }
    public deleteCrust = async (req: Request, res: Response) => {
        return this.deleteSystemItem(req, res);
    }
    public toggleCrustStatus = async (req: Request, res: Response) => {
        return this.toggleSystemItem(req, res);
    }

    private async saveSystemItem(req: Request, res: Response, sysCategory: string, id?: string) {
        const itemRepo = AppDataSource.getRepository(MenuItem);
        const data = req.body;

        let item;
        if (id) {
            item = await itemRepo.findOne({ where: { id } });
            if (!item) return res.status(404).json({ error: 'Item not found' });
        } else {
            const nameMap: Record<string, string> = {
                'sys_pizza_crusts': 'Pizza Crusts',
                'sys_pizza_doughs': 'Pizza Doughs',
                'sys_pizza_addons': 'Pizza Addons'
            };
            const catName = nameMap[sysCategory];
            let cat = await this.categoryRepository.findOne({
                where: { restaurantId: req.user.restaurantId, name: catName }
            });
            if (!cat) {
                cat = this.categoryRepository.create({
                    restaurantId: req.user.restaurantId,
                    name: catName,
                    isActive: true
                });
                await this.categoryRepository.save(cat);
            }

            const menu = await AppDataSource.getRepository(Menu).findOne({ where: { restaurantId: req.user.restaurantId } });
            if (!menu) return res.status(404).json({ error: 'Menu not found' });

            item = itemRepo.create();
            item.categoryId = cat.id;
            item.menu = menu;
        }

        item.name = data.name;
        item.isActive = data.enabled !== undefined ? data.enabled : item.isActive;

        if (data.price_add && typeof data.price_add.P === 'number') {
            item.price = data.price_add.P;
        }

        await itemRepo.save(item);
        return res.json(item);
    }

    private async deleteSystemItem(req: Request, res: Response) {
        const itemRepo = AppDataSource.getRepository(MenuItem);
        await itemRepo.delete(req.params.id);
        return res.json({ success: true });
    }

    private async toggleSystemItem(req: Request, res: Response) {
        const itemRepo = AppDataSource.getRepository(MenuItem);
        const item = await itemRepo.findOne({ where: { id: req.params.id } });
        if (!item) return res.status(404).json({ error: 'Item not found' });

        item.isActive = req.body.enabled;
        await itemRepo.save(item);
        return res.json(item);
    }

    public listDoughs = async (req: Request, res: Response) => {
        const items = await this.getSystemItems(req, 'sys_pizza_doughs');
        return res.json(items);
    }

    public createDough = async (req: Request, res: Response) => {
        return this.saveSystemItem(req, res, 'sys_pizza_doughs');
    }
    public updateDough = async (req: Request, res: Response) => {
        return this.saveSystemItem(req, res, 'sys_pizza_doughs', req.params.id);
    }
    public deleteDough = async (req: Request, res: Response) => {
        return this.deleteSystemItem(req, res);
    }
    public toggleDoughStatus = async (req: Request, res: Response) => {
        return this.toggleSystemItem(req, res);
    }

    public listAddons = async (req: Request, res: Response) => {
        const cat = await this.categoryRepository.findOne({
            where: {
                restaurantId: req.user.restaurantId,
                name: 'Pizza Addons'
            }
        });

        if (!cat) return res.json([]);

        const groups = await this.categoryRepository.find({ where: { pai: cat.id } });

        const result = await Promise.all(groups.map(async (group) => {
            const items = await AppDataSource.getRepository(MenuItem).find({
                where: { categoryId: group.id }
            });

            return {
                id: group.id,
                name: group.name,
                enabled: group.isActive,
                items: items.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: i.price ? Number(i.price) : 0,
                    enabled: i.isActive
                }))
            };
        }));

        return res.json(result);
    }

    public createAddonItem = async (req: Request, res: Response) => {
        try {
            const { group_id, name, price, enabled } = req.body;
            const itemRepo = AppDataSource.getRepository(MenuItem);
            let categoryId = group_id;

            if (!categoryId) {
                let addonsRoot = await this.categoryRepository.findOne({
                    where: { restaurantId: req.user.restaurantId, name: 'Pizza Addons' }
                });

                if (!addonsRoot) {
                    addonsRoot = this.categoryRepository.create({
                        restaurantId: req.user.restaurantId,
                        name: 'Pizza Addons',
                        isActive: true
                    });
                    await this.categoryRepository.save(addonsRoot);
                }

                if (addonsRoot) {
                    let defaultGroup = await this.categoryRepository.findOne({
                        where: { pai: addonsRoot.id, name: 'Adicionais Gerais' }
                    });

                    if (!defaultGroup) {
                        defaultGroup = this.categoryRepository.create({
                            restaurantId: req.user.restaurantId,
                            name: 'Adicionais Gerais',
                            isActive: true,
                            pai: addonsRoot.id
                        });
                        await this.categoryRepository.save(defaultGroup);
                    }
                    categoryId = defaultGroup.id;
                }
            }

            if (!categoryId) {
                return res.status(400).json({ error: 'Grupo de adicionais não encontrado ou inválido.' });
            }

            const menu = await AppDataSource.getRepository(Menu).findOne({ where: { restaurantId: req.user.restaurantId } });
            if (!menu) {
                return res.status(404).json({ error: 'Cardápio não encontrado para este restaurante.' });
            }

            const item = itemRepo.create({
                name,
                price: price,
                isActive: enabled !== undefined ? enabled : true,
                categoryId: categoryId,
                menu: menu
            });

            await itemRepo.save(item);
            return res.json(item);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message || 'Erro ao criar adicional.' });
        }
    }

    public updateAddonItem = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, price, enabled } = req.body;

        const itemRepo = AppDataSource.getRepository(MenuItem);
        const item = await itemRepo.findOne({ where: { id } });

        if (!item) return res.status(404).json({ error: 'Item not found' });

        if (name !== undefined) item.name = name;
        if (price !== undefined) item.price = price;
        if (enabled !== undefined) item.isActive = enabled;

        await itemRepo.save(item);
        return res.json(item);
    }

    public deleteAddonItem = async (req: Request, res: Response) => {
        const { id } = req.params;
        const itemRepo = AppDataSource.getRepository(MenuItem);
        await itemRepo.delete(id);
        return res.json({ success: true });
    }

    public toggleAddonItemStatus = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { enabled } = req.body;

        const itemRepo = AppDataSource.getRepository(MenuItem);
        const item = await itemRepo.findOne({ where: { id } });

        if (!item) return res.status(404).json({ error: 'Item not found' });

        item.isActive = enabled;
        await itemRepo.save(item);
        return res.json(item);
    }

    public listCompositionCategories = async (req: Request, res: Response) => {
        const categories = await this.categoryRepository.find({
            where: {
                restaurantId: req.user.restaurantId,
                isComposition: true,
                isActive: true
            },
            order: {
                order: 'ASC'
            }
        });

        const result = await Promise.all(categories.map(async (cat) => {
            const items = await AppDataSource.getRepository(MenuItem).find({
                where: { categoryId: cat.id, isActive: true }
            });
            return {
                ...cat,
                items: items.map(i => ({
                    id: i.id,
                    name: i.name,
                    price: Number(i.price)
                }))
            };
        }));

        return res.json(result);
    }
}

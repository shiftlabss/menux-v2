import { Request, Response } from 'express';
import { TypeOrmMenuItemRepository } from '@infrastructure/repositories/TypeOrmMenuItemRepository';
import { CreateMenuItem } from '@application/use-cases/menu-item/CreateMenuItem';
import { UpdateMenuItem } from '@application/use-cases/menu-item/UpdateMenuItem';
import { DeleteMenuItem } from '@application/use-cases/menu-item/DeleteMenuItem';
import { RedisCacheAdapter } from '@infrastructure/cache/redis/RedisCacheAdapter';

export class MenuItemsController {

    private invalidateMenuCache = async (restaurantId: string): Promise<void> => {
        const cache = new RedisCacheAdapter();
        await cache.del(`menux:api:prod:restaurant:${restaurantId}:menu:v1:active`);
        await cache.del(`menux:api:prod:restaurant:${restaurantId}:menu:v1:all`);
    }

    public create = async (req: Request, res: Response): Promise<Response> => {
        const { name, description, price, categoryId, isActive, imageUrl, allergens, code, ingredients, tags } = req.body;

        const menuItemRepository = new TypeOrmMenuItemRepository();
        const createMenuItem = new CreateMenuItem(menuItemRepository);

        const item = await createMenuItem.execute({
            name,
            description,
            price,
            categoryId,
            isActive,
            imageUrl,
            allergens,
            code,
            ingredients,
            tags,
        });

        if (req.user?.restaurantId) {
            await this.invalidateMenuCache(req.user.restaurantId);
        }

        return res.status(201).json(item);
    }

    public update = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const data = req.body;

        const menuItemRepository = new TypeOrmMenuItemRepository();
        const updateMenuItem = new UpdateMenuItem(menuItemRepository);

        const item = await updateMenuItem.execute({
            id,
            ...data,
        });

        if (req.user?.restaurantId) {
            await this.invalidateMenuCache(req.user.restaurantId);
        }

        return res.json(item);
    }

    public delete = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;

        const menuItemRepository = new TypeOrmMenuItemRepository();
        const deleteMenuItem = new DeleteMenuItem(menuItemRepository);

        await deleteMenuItem.execute(id);

        if (req.user?.restaurantId) {
            await this.invalidateMenuCache(req.user.restaurantId);
        }

        return res.status(204).send();
    }

    public index = async (req: Request, res: Response): Promise<Response> => {
        const { categoryId } = req.query;

        const menuItemRepository = new TypeOrmMenuItemRepository();

        let items;
        if (categoryId) {
            items = await menuItemRepository.findByCategoryId(categoryId as string);
        } else {
            const restaurantId = req.user?.restaurantId;
            items = await menuItemRepository.findByRestaurantId(restaurantId);
        }

        const mappedItems = items.map(item => ({
            ...item,
            is_active: item.isActive
        }));

        return res.json(mappedItems);
    }

    public show = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;

        const menuItemRepository = new TypeOrmMenuItemRepository();
        const item = await menuItemRepository.findById(id);

        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        return res.json(item);
    }
}

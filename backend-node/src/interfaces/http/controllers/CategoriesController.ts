import { Request, Response } from 'express';
import { TypeOrmCategoryRepository } from '@infrastructure/repositories/TypeOrmCategoryRepository';
import { CreateCategory } from '@application/use-cases/category/CreateCategory';
import { UpdateCategory } from '@application/use-cases/category/UpdateCategory';
import { DeleteCategory } from '@application/use-cases/category/DeleteCategory';
import { ReorderCategories } from '@application/use-cases/category/ReorderCategories';
import { RedisCacheAdapter } from '@infrastructure/cache/redis/RedisCacheAdapter';
import { AppError } from '@shared/errors';

import { logActivity } from '@shared/utils/auditLogger';

export class CategoriesController {
    private invalidateMenuCache = async (restaurantId: string): Promise<void> => {
        const cache = new RedisCacheAdapter();
        await cache.del(`menux:api:prod:restaurant:${restaurantId}:menu:v1:active`);
        await cache.del(`menux:api:prod:restaurant:${restaurantId}:menu:v1:all`);
    }

    public create = async (req: Request, res: Response): Promise<Response> => {
        const { name, order, isActive, restaurantId, pai, isComposition, isVisible, maxChoices, canPriceBeZero, isOptional, priceRule } = req.body;

        const categoryRepository = new TypeOrmCategoryRepository();
        const createCategory = new CreateCategory(categoryRepository);

        const category = await createCategory.execute({
            name,
            order,
            isActive,
            restaurantId: restaurantId || req.user?.restaurantId,
            pai,
            isComposition,
            isVisible,
            maxChoices,
            canPriceBeZero,
            isOptional,
            priceRule
        });

        await this.invalidateMenuCache(category.restaurantId);

        // Audit Log
        if (req.user?.id) {
            await logActivity(
                req.user.id,
                'CREATE',
                'Category',
                `Created category: ${category.name}`,
                category.id,
                { ...category },
                req
            );
        }

        return res.status(201).json(category);
    }

    public update = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const { name, order, isActive, pai, isComposition, isVisible, maxChoices, canPriceBeZero, isOptional, priceRule } = req.body;

        const categoryRepository = new TypeOrmCategoryRepository();
        const updateCategory = new UpdateCategory(categoryRepository);

        // Fetch old data for audit log
        const oldCategory = await categoryRepository.findById(id);

        const category = await updateCategory.execute({
            id,
            name,
            order,
            isActive,
            pai,
            isComposition,
            isVisible,
            maxChoices,
            canPriceBeZero,
            isOptional,
            priceRule
        });

        await this.invalidateMenuCache(category.restaurantId);

        if (req.user?.id) {
            await logActivity(
                req.user.id,
                'UPDATE',
                'Category',
                `Updated category: ${category.name}`,
                category.id,
                {
                    oldValue: oldCategory,
                    newValue: category
                },
                req
            );
        }

        return res.json(category);
    }

    public index = async (req: Request, res: Response): Promise<Response> => {
        const restaurantId = req.query.restaurantId as string || req.user?.restaurantId;
        const pai = req.query.pai as string;
        const system = req.query.system === 'true';

        console.log('System', system);

        const categoryRepository = new TypeOrmCategoryRepository();

        let categories;
        if (system) {
            const allCategories = await categoryRepository.findByRestaurantId(restaurantId);
            const pizzas = allCategories.find(c => c.name.toLowerCase().includes('pizza'));
            const wines = allCategories.find(c => c.name.toLowerCase().includes('vinho') || c.name.toLowerCase().includes('wine'));

            return res.json({
                pizzas_id: pizzas?.id,
                wines_id: wines?.id
            });
        }

        if (pai) {
            categories = await categoryRepository.findByParentId(pai);
        } else {
            categories = await categoryRepository.findByRestaurantId(restaurantId, true);
        }

        const mappedCategories = categories.map(cat => ({
            ...cat,
            is_active: cat.isActive
        }));

        return res.json(mappedCategories);
    }

    public show = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;

        const categoryRepository = new TypeOrmCategoryRepository();
        const category = await categoryRepository.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.json(category);
    }

    public delete = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;

        const categoryRepository = new TypeOrmCategoryRepository();
        const deleteCategory = new DeleteCategory(categoryRepository);

        try {
            await deleteCategory.execute(id);

            const restaurantId = req.user?.restaurantId;
            if (restaurantId) await this.invalidateMenuCache(restaurantId);

            if (req.user?.id) {
                await logActivity(
                    req.user.id,
                    'DELETE',
                    'Category',
                    `Deleted category with ID: ${id}`,
                    id,
                    null,
                    req
                );
            }

            return res.status(204).send();
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.code).json({
                    message: error.message
                });
            }
            throw error;
        }
    }

    public reorder = async (req: Request, res: Response): Promise<Response> => {
        const { ids } = req.body;

        const categoryRepository = new TypeOrmCategoryRepository();
        const reorderCategories = new ReorderCategories(categoryRepository);

        await reorderCategories.execute(ids);

        const restaurantId = req.user?.restaurantId;
        if (restaurantId) await this.invalidateMenuCache(restaurantId);

        if (req.user?.id) {
            await logActivity(
                req.user.id,
                'UPDATE',
                'Category',
                'Reordered categories',
                undefined,
                { ids },
                req
            );
        }

        return res.status(204).send();
    }
}

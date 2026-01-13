import { Request, Response } from 'express';
import { AppDataSource } from '@infrastructure/database/typeorm/data-source';
import { CategoryGroup } from '@domain/entities/CategoryGroup';
import { Category } from '@domain/entities/Category';

export class CategoryGroupsController {
    private categoryGroupRepository = AppDataSource.getRepository(CategoryGroup);
    private categoryRepository = AppDataSource.getRepository(Category);

    public index = async (req: Request, res: Response) => {
        const { categoryId } = req.params;
        const groups = await this.categoryGroupRepository.find({
            where: { categoryId },
            relations: ['compositionCategory', 'compositionCategory.items'],
            order: { order: 'ASC' }
        });

        // Map to include items and name at the top level
        const response = groups.map(group => ({
            ...group,
            name: group.compositionCategory?.name,
            items: group.compositionCategory?.items || []
        }));

        return res.json(response);
    }

    public store = async (req: Request, res: Response) => {
        const { categoryId } = req.params;
        const { compositionCategoryId, min, max, order } = req.body;

        const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
        if (!category) return res.status(404).json({ error: 'Category not found' });

        const compositionCategory = await this.categoryRepository.findOne({ where: { id: compositionCategoryId } });
        if (!compositionCategory) return res.status(404).json({ error: 'Composition Category not found' });

        const group = this.categoryGroupRepository.create({
            categoryId,
            compositionCategoryId,
            min,
            max,
            order: order || 0
        });

        await this.categoryGroupRepository.save(group);
        return res.status(201).json(group);
    }

    public update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { min, max, order } = req.body;

        const group = await this.categoryGroupRepository.findOne({ where: { id } });
        if (!group) return res.status(404).json({ error: 'Group link not found' });

        if (min !== undefined) group.min = min;
        if (max !== undefined) group.max = max;
        if (order !== undefined) group.order = order;

        await this.categoryGroupRepository.save(group);
        return res.json(group);
    }

    public delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        await this.categoryGroupRepository.delete(id);
        return res.status(204).send();
    }
}

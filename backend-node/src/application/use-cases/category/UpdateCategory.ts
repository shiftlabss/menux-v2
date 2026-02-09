import { Category } from '@domain/entities/Category';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { AppError } from '@shared/errors';

interface IRequest {
    id: string;
    name?: string;
    order?: number;
    isActive?: boolean;
    pai?: string;
    isComposition?: boolean;
    isVisible?: boolean;
    maxChoices?: number;
    canPriceBeZero?: boolean;
    isOptional?: boolean;
    priceRule?: 'SUM' | 'AVERAGE' | 'HIGHEST' | 'NONE';
}

export class UpdateCategory {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute({ id, name, order, isActive, pai, isComposition, isVisible, maxChoices, canPriceBeZero, isOptional, priceRule }: IRequest): Promise<Category> {
        const category = await this.categoryRepository.findById(id);

        if (!category) {
            throw new AppError('Category not found', 404);
        }

        if (name) category.name = name;
        if (order !== undefined) category.order = order;
        if (isActive !== undefined) category.isActive = isActive;
        if (pai !== undefined) category.pai = pai || null;
        if (isComposition !== undefined) category.isComposition = isComposition;
        if (isVisible !== undefined) category.isVisible = isVisible;
        if (maxChoices !== undefined) category.maxChoices = maxChoices;
        if (canPriceBeZero !== undefined) category.canPriceBeZero = canPriceBeZero;
        if (isOptional !== undefined) category.isOptional = isOptional;
        if (priceRule !== undefined) category.priceRule = priceRule;

        return this.categoryRepository.save(category);
    }
}

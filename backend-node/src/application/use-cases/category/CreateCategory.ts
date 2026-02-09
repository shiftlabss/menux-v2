import { Category } from '@domain/entities/Category';
import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';

interface IRequest {
    name: string;
    order?: number;
    isActive?: boolean;
    restaurantId: string;
    pai?: string;
    isComposition?: boolean;
    isVisible?: boolean;
    maxChoices?: number;
    canPriceBeZero?: boolean;
    isOptional?: boolean;
    priceRule?: 'SUM' | 'AVERAGE' | 'HIGHEST' | 'NONE';
}

export class CreateCategory {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute({ name, order, isActive, restaurantId, pai, isComposition, isVisible, maxChoices, canPriceBeZero, isOptional, priceRule }: IRequest): Promise<Category> {
        const category = new Category();
        category.name = name;
        category.order = order || 0;
        category.isActive = isActive !== undefined ? isActive : true;
        category.restaurantId = restaurantId;
        category.pai = pai || null;
        category.isComposition = isComposition || false;
        category.isVisible = isVisible !== undefined ? isVisible : true;
        category.maxChoices = (maxChoices !== undefined && maxChoices !== null) ? Number(maxChoices) : null;
        if (Number.isNaN(category.maxChoices)) category.maxChoices = null;
        category.canPriceBeZero = canPriceBeZero || false;
        category.isOptional = isOptional || false;
        category.priceRule = priceRule || 'SUM';

        return this.categoryRepository.create(category);
    }
}

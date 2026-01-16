import { IMenuItemRepository } from '@domain/repositories/IMenuItemRepository';
import { MenuItem } from '@domain/entities/MenuItem';
import { ChoiceItem } from '@domain/entities/ChoiceItem';
import { AppError } from '@shared/errors';
import { processImageField } from '@infrastructure/storage/S3Service';

interface IRequest {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    categoryId?: string;
    isActive?: boolean;
    imageUrl?: string;
    allergens?: string;
    code?: string;
    ingredients?: string;
    tags?: string[];
    menuId?: string;
<<<<<<< HEAD
    menuType?: 'PRODUCT' | 'WINE' | 'PIZZA';
    maxChoices?: number;
    optionsConfig?: any;
    choiceItems?: { parentMenuItemId: string; choosenMenuItemId: string; extra_price?: number; order?: number }[];
    // Wine-specific fields
    vintage?: string;
    country?: string;
    winery?: string;
    grape?: string;
    region?: string;
    style?: string;
    glassPrice?: number;
=======
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)
}

export class UpdateMenuItem {
    constructor(private menuItemRepository: IMenuItemRepository) { }

    async execute(data: IRequest): Promise<MenuItem> {
        const item = await this.menuItemRepository.findById(data.id);

        if (!item) {
            throw new AppError('Menu item not found', 404);
        }

        // Process image: upload to S3 if base64
        if (data.imageUrl !== undefined) {
            data.imageUrl = await processImageField(data.imageUrl, 'menu-items') || undefined;
        }

        Object.assign(item, data);


        if (data.choiceItems && Array.isArray(data.choiceItems)) {
            // Fix: TypeORM tries to nullify parentMenuItemId on update instead of deleting, violating NOT NULL.
            // We manually clear existing choices first.
            await this.menuItemRepository.clearChoiceItems(item.id);
            item.choiceItems = [];
            data.choiceItems.forEach((choice: any) => {
                const choiceItem = new ChoiceItem();
                choiceItem.parentMenuItemId = choice.parentMenuItemId;
                choiceItem.choosenMenuItemId = choice.choosenMenuItemId;
                choiceItem.extra_price = choice.extra_price || 0;
                choiceItem.order = choice.order || 0;
                choiceItem.isActive = true;
                // choiceItem.parentMenuItem = item;
                item.choiceItems.push(choiceItem);
            });
        }

        return this.menuItemRepository.save(item);
    }
}

import { IMenuItemRepository } from '@domain/repositories/IMenuItemRepository';
import { MenuItem } from '@domain/entities/MenuItem';
import { ChoiceItem } from '@domain/entities/ChoiceItem';
import { processImageField } from '@infrastructure/storage/S3Service';

interface IRequest {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    isActive?: boolean;
    imageUrl?: string;
    allergens?: string;
    code?: string;
    ingredients?: string;
    tags?: string[];
    menuId: string;
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
}

export class CreateMenuItem {
    constructor(private menuItemRepository: IMenuItemRepository) { }

    async execute(data: IRequest): Promise<MenuItem> {
        // Process image: upload to S3 if base64
        const processedImageUrl = await processImageField(data.imageUrl, 'menu-items');

        const item = new MenuItem();
        Object.assign(item, {
            ...data,
            imageUrl: processedImageUrl,
            isActive: data.isActive ?? true,
        });

        if (data.choiceItems && Array.isArray(data.choiceItems)) {
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

        return this.menuItemRepository.create(item);
    }
}

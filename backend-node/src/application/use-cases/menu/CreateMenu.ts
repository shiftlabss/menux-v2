import { IMenuRepository } from '@domain/repositories/IMenuRepository';
import { Menu, MenuType } from '@domain/entities/Menu';

interface IRequest {
    name: string;
    description?: string;
    restaurantId: string;
    isActive?: boolean;
    type?: MenuType;
}

export class CreateMenuUseCase {
    constructor(private menuRepository: IMenuRepository) { }

    async execute(data: IRequest): Promise<Menu> {
        const menu = await this.menuRepository.create({
            name: data.name,
            description: data.description,
            restaurantId: data.restaurantId,
            isActive: data.isActive ?? true,
            type: data.type || MenuType.PRODUCT
        });
        return menu;
    }
}

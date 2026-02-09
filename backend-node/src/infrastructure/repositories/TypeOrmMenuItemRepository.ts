import { Repository, Brackets } from 'typeorm';
import { IMenuItemRepository } from '@domain/repositories/IMenuItemRepository';
import { MenuItem } from '@domain/entities/MenuItem';
import { ChoiceItem } from '@domain/entities/ChoiceItem';
import { AppDataSource } from '../database/typeorm/data-source';


export class TypeOrmMenuItemRepository implements IMenuItemRepository {
    private repository: Repository<MenuItem>;

    constructor() {
        this.repository = AppDataSource.getRepository(MenuItem);
    }

    async create(item: MenuItem): Promise<MenuItem> {
        const created = this.repository.create(item);
        return await this.repository.save(created);
    }

    async save(item: MenuItem): Promise<MenuItem> {
        return await this.repository.save(item);
    }

    async findById(id: string): Promise<MenuItem | null> {
        // const item = await this.repository.createQueryBuilder('item')
        //     .leftJoinAndSelect('item.choiceItems', 'choiceItems')
        //     .where('item.id = :id', { id })
        //     .getOne();

        // console.log('DEBUG: findById result:', JSON.stringify(item, null, 2));

        const item = await this.repository.findOne({
            where: { id },
            relations: ['category', 'choiceItems', 'choiceItems.choosenMenuItem', 'choiceItems.choosenMenuItem.category']
        });

        return item;


    }

    async findByCategoryId(categoryId: string): Promise<MenuItem[]> {
        return await this.repository.find({
            where: { categoryId }
        });
    }

    async findByRestaurantId(restaurantId: string, menuType?: any): Promise<MenuItem[]> {
        // Since MenuItem doesn't have restaurantId directly (it's in Category)
        const where: any = { category: { restaurantId } };

        if (menuType) {
            where.menuType = menuType;
        }

        return await this.repository.find({
            where,
            relations: ['category']
        });
    }

    async findByTags(tags: string[], restaurantId: string): Promise<MenuItem[]> {
        const query = this.repository.createQueryBuilder('item')
            .leftJoinAndSelect('item.category', 'category')
            .where('category.restaurantId = :restaurantId', { restaurantId })
            .andWhere('item.isActive = :isActive', { isActive: true });

        if (tags.length > 0) {
            query.andWhere(new Brackets(qb => {
                tags.forEach((tag, index) => {
                    qb.orWhere(`item.tags LIKE :tag${index}`, { [`tag${index}`]: `%${tag}%` });
                });
            }));
        }

        return await query.getMany();
    }

    async delete(id: string): Promise<void> {
        await this.repository.softDelete(id);
    }

    async clearChoiceItems(menuItemId: string): Promise<void> {
        await AppDataSource.getRepository(ChoiceItem).delete({ parentMenuItemId: menuItemId });
    }
}

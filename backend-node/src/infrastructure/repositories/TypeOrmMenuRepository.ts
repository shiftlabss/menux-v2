import { IMenuRepository } from '@domain/repositories/IMenuRepository';
import { Category } from '@domain/entities/Category';
import { MenuItem } from '@domain/entities/MenuItem';
import { Repository, IsNull } from 'typeorm';
import { AppDataSource } from '../database/typeorm/data-source';

export class TypeOrmMenuRepository implements IMenuRepository {
  private categoryRepo: Repository<Category>;
  private itemRepo: Repository<MenuItem>;

  constructor() {
    this.categoryRepo = AppDataSource.getRepository(Category);
    this.itemRepo = AppDataSource.getRepository(MenuItem);
  }

  async findAllCategoriesWithItems(restaurantId: string, onlyActive = true): Promise<Category[]> {
    const where: any = { restaurantId, pai: IsNull() };
    if (onlyActive) {
      where.isActive = true;
    }

    return this.categoryRepo.find({
      where,
      relations: ['items', 'subcategories', 'subcategories.items'],
      order: {
        order: 'ASC'
      },
    });
  }

  async findItemById(itemId: string): Promise<MenuItem | null> {
    return this.itemRepo.findOne({
      where: { id: itemId },
      relations: ['category'],
    });
  }
}

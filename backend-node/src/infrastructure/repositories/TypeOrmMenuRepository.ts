import { IMenuRepository } from '@domain/repositories/IMenuRepository';
import { Category } from '@domain/entities/Category';
import { MenuItem } from '@domain/entities/MenuItem';
import { Menu } from '@domain/entities/Menu';
import { Repository, IsNull } from 'typeorm';
import { AppDataSource } from '../database/typeorm/data-source';

export class TypeOrmMenuRepository implements IMenuRepository {
  private categoryRepo: Repository<Category>;
  private itemRepo: Repository<MenuItem>;
  private menuRepo: Repository<Menu>;

  constructor() {
    this.categoryRepo = AppDataSource.getRepository(Category);
    this.itemRepo = AppDataSource.getRepository(MenuItem);
    this.menuRepo = AppDataSource.getRepository(Menu);
  }

  async findAllCategoriesWithItems(restaurantId: string, onlyActive = true): Promise<Category[]> {
    const where: any = { restaurantId, pai: IsNull() };
    if (onlyActive) {
      where.isActive = true;
    }

    return this.categoryRepo.find({
      where,
      relations: [
        'items',
        'subcategories',
        'subcategories.items',
        'subcategories.items.choiceItems',
        'subcategories.items.choiceItems.choosenMenuItem',
        'subcategories.items.choiceItems.choosenMenuItem.category',
        'items.choiceItems',
        'items.choiceItems.choosenMenuItem',
        'items.choiceItems.choosenMenuItem.category'
      ],
      order: { name: 'ASC' }
    });
  }

  async findItemById(itemId: string): Promise<MenuItem | null> {
    return this.itemRepo.findOne({
      where: { id: itemId },
      relations: ['category', 'choiceItems'],
    });
  }

  async create(menu: Partial<Menu>): Promise<Menu> {
    const newMenu = this.menuRepo.create(menu);
    return this.menuRepo.save(newMenu);
  }

  async findAll(restaurantId: string): Promise<Menu[]> {
    return this.menuRepo.find({
      where: { restaurantId },
      relations: ['items'],
    });
  }

  async findById(id: string): Promise<Menu | null> {
    return this.menuRepo.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async update(id: string, menu: Partial<Menu>): Promise<Menu> {
    await this.menuRepo.update(id, menu);
    return this.menuRepo.findOneOrFail({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.menuRepo.delete(id);
  }
}

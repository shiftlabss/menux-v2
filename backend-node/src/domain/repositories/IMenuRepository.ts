import { Category } from '../entities/Category';
import { MenuItem } from '../entities/MenuItem';

export interface IMenuRepository {
  /**
   * Finds all categories with their items for a specific restaurant.
   * Useful for building the full menu view.
   */
  findAllCategoriesWithItems(restaurantId: string, onlyActive?: boolean): Promise<Category[]>;

  /**
   * Finds a specific menu item by ID.
   */
  findItemById(itemId: string): Promise<MenuItem | null>;
}

import { ICategoryRepository } from '@domain/repositories/ICategoryRepository';
import { AppError } from '@shared/errors';

export class DeleteCategory {
    constructor(private categoryRepository: ICategoryRepository) { }

    async execute(id: string): Promise<void> {
        const category = await this.categoryRepository.findById(id);

        if (!category) {
            throw new AppError('Category not found', 404);
        }

        // Check if it has subcategories? 
        // The repository should probably handle or we can check here.
        if (category.subcategories && category.subcategories.length > 0) {
            throw new AppError('Cannot delete category with subcategories', 400);
        }

        try {
            await this.categoryRepository.delete(id);
        } catch (error: any) {
            if (error.code === '23503') {
                throw new AppError('Não é possível excluir esta categoria pois existem produtos vinculados a ela.', 400);
            }
            throw error;
        }
    }
}

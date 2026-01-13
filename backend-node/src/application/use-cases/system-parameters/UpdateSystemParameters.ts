import { SystemParameter } from '@domain/entities/SystemParameter';
import { ISystemParameterRepository } from '@domain/repositories/ISystemParameterRepository';

interface IRequest {
    restaurantId: string;
    pizzaCategoryId?: string;
    wineCategoryId?: string;
}

export class UpdateSystemParameters {
    constructor(private systemParameterRepository: ISystemParameterRepository) { }

    async execute({ restaurantId, pizzaCategoryId, wineCategoryId }: IRequest): Promise<SystemParameter> {
        let parameters = await this.systemParameterRepository.findByRestaurantId(restaurantId);

        if (!parameters) {
            parameters = new SystemParameter();
            parameters.restaurantId = restaurantId;
        }

        if (pizzaCategoryId !== undefined) {
            parameters.pizzaCategoryId = pizzaCategoryId === '' ? null : pizzaCategoryId;
            // TypeORM hack: Clear the loaded relation to ensure the new ID is saved
            // If the relation object exists, TypeORM might ignore the ID change
            if ((parameters as any).pizzaCategory) {
                (parameters as any).pizzaCategory = null;
            }
        }

        if (wineCategoryId !== undefined) {
            parameters.wineCategoryId = wineCategoryId === '' ? null : wineCategoryId;
            // TypeORM hack: Clear the loaded relation to ensure the new ID is saved
            if ((parameters as any).wineCategory) {
                (parameters as any).wineCategory = null;
            }
        }

        return this.systemParameterRepository.save(parameters);
    }
}

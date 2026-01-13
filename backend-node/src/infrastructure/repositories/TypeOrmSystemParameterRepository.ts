import { Repository } from 'typeorm';
import { AppDataSource } from '../database/typeorm/data-source';
import { SystemParameter } from '@domain/entities/SystemParameter';
import { ISystemParameterRepository } from '@domain/repositories/ISystemParameterRepository';

export class TypeOrmSystemParameterRepository implements ISystemParameterRepository {
    private repository: Repository<SystemParameter>;

    constructor() {
        this.repository = AppDataSource.getRepository(SystemParameter);
    }

    async findByRestaurantId(restaurantId: string): Promise<SystemParameter | null> {
        return this.repository.findOne({
            where: { restaurantId },
            relations: ['pizzaCategory', 'wineCategory']
        });
    }

    async save(systemParameter: SystemParameter): Promise<SystemParameter> {
        return this.repository.save(systemParameter);
    }
}

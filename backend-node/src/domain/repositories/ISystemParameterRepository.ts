import { SystemParameter } from '../entities/SystemParameter';

export interface ISystemParameterRepository {
    findByRestaurantId(restaurantId: string): Promise<SystemParameter | null>;
    save(systemParameter: SystemParameter): Promise<SystemParameter>;
}

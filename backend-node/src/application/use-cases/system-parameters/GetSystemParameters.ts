import { SystemParameter } from '@domain/entities/SystemParameter';
import { ISystemParameterRepository } from '@domain/repositories/ISystemParameterRepository';

export class GetSystemParameters {
    constructor(private systemParameterRepository: ISystemParameterRepository) { }

    async execute(restaurantId: string): Promise<SystemParameter | null> {
        let parameters = await this.systemParameterRepository.findByRestaurantId(restaurantId);

        if (!parameters) {
            // Return a virtual object if not found, or maybe initialize it?
            // For now let's just return null and handle it in the controller
            return null;
        }

        return parameters;
    }
}

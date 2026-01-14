import { Repository } from 'typeorm';
import { AppDataSource } from '../database/typeorm/data-source';
import { Order } from '@domain/entities/Order';
import { IOrderRepository } from '@domain/repositories/IOrderRepository';

export class TypeOrmOrderRepository implements IOrderRepository {
    private ormRepository: Repository<Order>;

    constructor() {
        this.ormRepository = AppDataSource.getRepository(Order);
    }

    public async findById(id: string): Promise<Order | undefined> {
        const order = await this.ormRepository.findOne({
            where: { id },
            relations: ['items', 'items.menuItem', 'restaurant', 'waiter', 'table'],
        });

        return order || undefined;
    }

    public async save(order: Order): Promise<Order> {
        return this.ormRepository.save(order);
    }

    public async listByRestaurant(restaurantId: string): Promise<Order[]> {
        return this.ormRepository.find({
            where: { restaurantId },
            relations: ['items', 'items.menuItem', 'restaurant', 'waiter', 'table'],
            order: { createdAt: 'DESC' }
        });
    }
}

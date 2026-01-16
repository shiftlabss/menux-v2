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

    public async findByTransactionId(transactionId: string): Promise<Order | undefined> {
        const order = await this.ormRepository.findOne({
            where: { transactionId },
            relations: ['items', 'items.menuItem', 'restaurant', 'waiter', 'table'],
        });
        return order || undefined;
    }

    public async existsByCodeInLast24h(code: string, restaurantId: string): Promise<boolean> {
        const result = await this.ormRepository.createQueryBuilder('order')
            .where('order.code = :code', { code })
            .andWhere('order.restaurantId = :restaurantId', { restaurantId })
            .andWhere('order.createdAt > :date', { date: new Date(Date.now() - 24 * 60 * 60 * 1000) })
            .getCount();

        return result > 0;
    }

    public async findByCustomerInLast24h(customerId: string, restaurantId: string): Promise<Order[]> {
        const date24AhAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        return this.ormRepository.createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.menuItem', 'menuItem')
            .leftJoinAndSelect('order.restaurant', 'restaurant')
            .leftJoinAndSelect('order.waiter', 'waiter')
            .leftJoinAndSelect('order.table', 'table')
            .where('order.customerId = :customerId', { customerId })
            .andWhere('order.restaurantId = :restaurantId', { restaurantId })
            .andWhere('order.createdAt > :date', { date: date24AhAgo })
            .orderBy('order.createdAt', 'DESC')
            .getMany();
    }

}

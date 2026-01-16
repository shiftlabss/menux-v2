import { Order } from '../entities/Order';

export interface IOrderRepository {
    findById(id: string): Promise<Order | undefined>;
    save(order: Order): Promise<Order>;
    listByRestaurant(restaurantId: string): Promise<Order[]>;
    findByTransactionId(transactionId: string): Promise<Order | undefined>;
    existsByCodeInLast24h(code: string, restaurantId: string): Promise<boolean>;
    findByCustomerInLast24h(customerId: string, restaurantId: string): Promise<Order[]>;
}

import { Order } from '../entities/Order';

export interface IOrderRepository {
    findById(id: string): Promise<Order | undefined>;
    save(order: Order): Promise<Order>;
    listByRestaurant(restaurantId: string): Promise<Order[]>;
}

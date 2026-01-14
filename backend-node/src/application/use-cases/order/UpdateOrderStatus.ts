import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { Order, OrderStatus } from '@domain/entities/Order';
import { AppError } from '../../../shared/errors';

interface IRequest {
    orderId: string;
    status: OrderStatus;
    restaurantId: string;
}

export class UpdateOrderStatus {
    constructor(
        private orderRepository: IOrderRepository
    ) { }

    async execute({ orderId, status, restaurantId }: IRequest): Promise<Order> {
        const order = await this.orderRepository.findById(orderId);

        if (!order) {
            throw new AppError('Order not found.', 404);
        }

        if (order.restaurantId !== restaurantId) {
            throw new AppError('Order does not belong to this restaurant.', 403);
        }

        order.status = status;

        return this.orderRepository.save(order);
    }
}

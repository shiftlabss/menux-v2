import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { AppError } from '@shared/errors';
import { Order } from '@domain/entities/Order';

interface IRequest {
    code: string;
    restaurantId: string;
}

export class GetOrderByCode {
    constructor(
        private orderRepository: IOrderRepository
    ) { }

    async execute({ code, restaurantId }: IRequest): Promise<Order> {
        const order = await this.orderRepository.findByCode(code, restaurantId);

        if (!order) {
            throw new AppError('Pedido não encontrado.', 404);
        }

        return order;
    }
}

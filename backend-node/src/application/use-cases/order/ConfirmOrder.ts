import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { ITableRepository } from '@domain/repositories/ITableRepository';
import { AppError } from '@shared/errors';
import { Order, OrderStatus } from '@domain/entities/Order';
import { TableStatus } from '@domain/entities/Table';

interface IRequest {
    code: string;
    restaurantId: string;
    tableNumber: number;
    waiterId: string;
    waiterName?: string;
    waiterNickname?: string;
}

export class ConfirmOrder {
    constructor(
        private orderRepository: IOrderRepository,
        private tableRepository: ITableRepository
    ) { }

    async execute({ code, restaurantId, tableNumber, waiterId }: IRequest): Promise<Order> {
        // Validation of waiter name could happen here if needed
        // console.log(`Order confirmed by ${waiterName} (${waiterNickname})`);
        // 1. Confirm Order logic
        const order = await this.orderRepository.findByCode(code, restaurantId);

        if (!order) {
            throw new AppError('Pedido não encontrado.', 404);
        }

        // Validate status
        if (order.status !== OrderStatus.WAITING) {
            throw new AppError(`Pedido não está aguardando confirmação. Status atual: ${order.status}`, 400);
        }


        // 2. Table Logic
        const table = await this.tableRepository.findByNumber(restaurantId, tableNumber);

        if (!table) {
            throw new AppError('Mesa não encontrada.', 404);
        }

        if (table.status === TableStatus.CLOSED) {
            throw new AppError('Mesa está encerrada e não pode receber novos pedidos.', 400);
        }

        // If free, occupy
        if (table.status === TableStatus.FREE) {
            table.status = TableStatus.OCCUPIED;
        }


        // Atualizando o id da mesa no pedido de acordo com o id da mesa encontrado
        order.status = OrderStatus.PREPARING;
        order.tableNumber = String(tableNumber);
        order.tableId = table.id;
        order.waiterId = waiterId ? waiterId : order.waiterId;

        await this.orderRepository.save(order);

        // 3. Update Table Total
        const total = await this.orderRepository.calculateTableTotalByNumber(tableNumber.toString(), restaurantId);
        table.total = total;
        table.waiterId = waiterId ? waiterId : table.waiterId;


        await this.tableRepository.save(table);

        return order;
    }
}

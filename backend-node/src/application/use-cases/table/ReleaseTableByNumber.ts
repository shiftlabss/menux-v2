import { ITableRepository } from '@domain/repositories/ITableRepository';
import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { Table, TableStatus } from '@domain/entities/Table';
import { AppError } from '@shared/errors';

interface IRequest {
    tableNumber: number;
    restaurantId: string;
}

export class ReleaseTableByNumber {
    constructor(
        private tableRepository: ITableRepository,
        private orderRepository: IOrderRepository
    ) { }

    public async execute({ tableNumber, restaurantId }: IRequest): Promise<Table> {
        const table = await this.tableRepository.findByNumber(restaurantId, tableNumber);

        if (!table) {
            throw new AppError('Table not found or does not belong to this restaurant', 404);
        }

        // Finish all active orders for this table
        await this.orderRepository.finishOrdersByTableNumber(String(table.number), restaurantId);

        // Reset table status and properties
        table.status = TableStatus.FREE;
        table.total = 0;
        table.waiterId = null;
        table.waiter = null;
        table.closedAt = new Date();
        table.currentPeople = 0;

        return this.tableRepository.save(table);
    }
}

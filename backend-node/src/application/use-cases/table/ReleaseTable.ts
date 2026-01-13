import { ITableRepository } from '@domain/repositories/ITableRepository';
import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { Table, TableStatus } from '@domain/entities/Table';
import { AppError } from '@shared/errors';

interface IRequest {
    tableId: string;
    restaurantId: string;
}

export class ReleaseTable {
    constructor(
        private tableRepository: ITableRepository,
        private orderRepository: IOrderRepository
    ) { }

    public async execute({ tableId, restaurantId }: IRequest): Promise<Table> {
        const table = await this.tableRepository.findById(tableId);

        if (!table) {
            throw new AppError('Table not found', 404);
        }

        if (table.restaurantId !== restaurantId) {
            throw new AppError('Table does not belong to this restaurant', 403);
        }

        // Finish all active orders for this table
        // We need to use table.number because our previously created method uses tableNumber
        // Or we should update repository to use ID. Using what we have: finishOrdersByTableNumber
        // Let's verify if Table entity has number property populated. It should.

        await this.orderRepository.finishOrdersByTableNumber(String(table.number), restaurantId);

        // Reset table status and properties
        table.status = TableStatus.FREE;
        table.total = 0;
        table.waiterId = null;
        table.waiter = null;
        table.closedAt = new Date();
        table.currentPeople = 0; // Reset people count as well since it's free now

        return this.tableRepository.save(table);
    }
}

import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { ITableRepository } from '@domain/repositories/ITableRepository';
import { IWaiterRepository } from '@domain/repositories/IWaiterRepository';
import { IHashProvider } from '@domain/providers/IHashProvider';
import { AppError } from '@shared/errors';
import { TableStatus } from '@domain/entities/Table';

interface IRequest {
    restaurantId: string;
    tableNumber: number;
    status: 'CLOSED' | 'OCCUPIED';
    waiterCode: string;
    waiterPassword?: string;
}

export class ChangeTableStatus {
    constructor(
        private orderRepository: IOrderRepository,
        private tableRepository: ITableRepository,
        private waiterRepository: IWaiterRepository,
        private hashProvider: IHashProvider
    ) { }

    public async execute({
        restaurantId,
        tableNumber,
        status,
        waiterCode,
        waiterPassword,
    }: IRequest): Promise<void> {

        // 1. Validate Waiter
        const waiter = await this.waiterRepository.findByPinCode(restaurantId, waiterCode);
        if (!waiter) {
            throw new AppError('Garçom não encontrado ou código inválido.');
        }

        // Validate password if provided or required
        if (waiter.password) {
            if (!waiterPassword) {
                throw new AppError('Senha é obrigatória.');
            }
            const passwordMatched = await this.hashProvider.compareHash(waiterPassword, waiter.password);
            if (!passwordMatched) {
                throw new AppError('Senha incorreta.');
            }
        }

        // Check permission
        if (!waiter.canCloseTable) {
            throw new AppError('Garçom não tem permissão para alterar status/encerrar mesa.');
        }

        // 2. Validate Table
        const table = await this.tableRepository.findByNumber(restaurantId, tableNumber);
        if (!table) {
            throw new AppError('Mesa não encontrada.');
        }

        // 3. Update Status
        // Convert string status to Enum
        let newStatus: TableStatus;
        if (status === 'CLOSED') {
            newStatus = TableStatus.CLOSED; // Or CLOSING? usually CLOSED implies finished.
        } else if (status === 'OCCUPIED') {
            newStatus = TableStatus.OCCUPIED;
        } else {
            throw new AppError('Status inválido. Use CLOSED ou OCCUPIED.');
        }

        await this.tableRepository.updateStatus(table.id, newStatus);

        // 4. Finish Orders if Closing
        if (newStatus === TableStatus.CLOSED) {
            await this.orderRepository.finishOrdersByTableNumber(String(tableNumber), restaurantId);
        }
    }
}

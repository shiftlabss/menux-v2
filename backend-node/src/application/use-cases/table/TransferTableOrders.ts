import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { ITableRepository } from '@domain/repositories/ITableRepository';
import { IWaiterRepository } from '@domain/repositories/IWaiterRepository';
import { IHashProvider } from '@domain/providers/IHashProvider';
import { AppError } from '@shared/errors';
import { TableStatus } from '@domain/entities/Table';

interface IRequest {
    restaurantId: string;
    sourceTableNumber: number;
    destinationTableNumber: number;
    waiterCode: string;
    waiterPassword?: string;
}

export class TransferTableOrders {
    constructor(
        private orderRepository: IOrderRepository,
        private tableRepository: ITableRepository,
        private waiterRepository: IWaiterRepository,
        private hashProvider: IHashProvider
    ) { }

    public async execute({
        restaurantId,
        sourceTableNumber,
        destinationTableNumber,
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
        if (!waiter.canTransferOrders) {
            throw new AppError('Garçom não tem permissão para realizar transferências.');
        }

        // 2. Validate Tables
        const sourceTable = await this.tableRepository.findByNumber(restaurantId, sourceTableNumber);
        if (!sourceTable) {
            throw new AppError('Mesa de origem não encontrada.');
        }

        const destinationTable = await this.tableRepository.findByNumber(restaurantId, destinationTableNumber);
        if (!destinationTable) {
            throw new AppError('Mesa de destino não encontrada.');
        }

        // 3. Validate Destination Status
        // "diferente de 'encerrando' e diferente de 'inativa' (CLOSED)"
        if (destinationTable.status === TableStatus.CLOSING || destinationTable.status === TableStatus.CLOSED) {
            throw new AppError('Mesa de destino inválida (Encerrando ou Inativa).');
        }

        // 4. Transfer Orders
        // Transfers only active orders (not FINISHED/CANCELED)
        await this.orderRepository.transferOrders(sourceTable.id, destinationTable.id);

        // 5. Update Table Statuses
        // Set Source to FREE (assuming empty now)
        await this.tableRepository.updateStatus(sourceTable.id, TableStatus.FREE);

        // Set Destination to OCCUPIED (if it was FREE)
        if (destinationTable.status === TableStatus.FREE) {
            await this.tableRepository.updateStatus(destinationTable.id, TableStatus.OCCUPIED);
        }
    }
}

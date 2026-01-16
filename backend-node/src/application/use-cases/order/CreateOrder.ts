import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { IMenuRepository } from '@domain/repositories/IMenuRepository';
import { Order, OrderStatus } from '@domain/entities/Order';
import { OrderItem } from '@domain/entities/OrderItem';
import { AppError } from '../../../shared/errors';
import { ICachePort } from '@application/ports/ICachePort';

interface ICreateOrderRequest {
    restaurantId: string;
    items: {
        menuItemId: string;
        quantity: number;
        observation?: string;
    }[];
    tableId?: string;
    waiterId?: string;
    customerName?: string;
    tableNumber?: string;
    transactionId?: string;
}

export class CreateOrder {
    constructor(
        private orderRepository: IOrderRepository,
        private menuRepository: IMenuRepository,
        private cachePort: ICachePort
    ) { }

    async execute({ restaurantId, items, tableId, waiterId, tableNumber, transactionId }: ICreateOrderRequest): Promise<Order> {
        // 1. Idempotency Check
        if (transactionId) {
            const existingOrder = await this.orderRepository.findByTransactionId(transactionId);
            if (existingOrder) {
                return existingOrder;
            }
        }

        if (!items || items.length === 0) {
            throw new AppError('Order must have at least one item.');
        }

        const order = new Order();
        order.restaurantId = restaurantId;
        order.status = OrderStatus.WAITING;
        order.tableNumber = tableNumber ? String(tableNumber) : null;
        order.transactionId = transactionId || null;

        // 2. Atomic Order Code Generation via Redis
        // Key format: restaurant:{id}:order_counter
        // This ensures sequential, unique numbers without collisions.
        const counterKey = `restaurant:${restaurantId}:order_counter`;
        const nextOrderNumber = await this.cachePort.incr(counterKey);

        // Format to string, e.g. "1001", "1002" or just simple number 
        // If we want to simulate the 4-digit code (e.g. 0001) or just meaningful number
        // Let's assume just the number as string for now, or pad it if needed.
        // User asked for "Atomic counter funcione", usually implies just sequential.
        // If we want to reset daily, we would need a key with date, e.g. `restaurant:${id}:date:${today}:order_counter`
        // But for "last 24h" uniqueness or general sequence, a global increment is safest for now.
        order.code = nextOrderNumber.toString();

        if (tableId) {
            order.tableId = tableId;
        }

        if (waiterId) {
            order.waiterId = waiterId;
        }

        // We are relying on the cascade to save items, but we need to fetch info first
        order.items = [];
        let total = 0;

        for (const itemData of items) {
            const menuItem = await this.menuRepository.findItemById(itemData.menuItemId);

            if (!menuItem) {
                throw new AppError(`Menu item not found: ${itemData.menuItemId}`);
            }

            const orderItem = new OrderItem();
            orderItem.menuItem = menuItem;
            orderItem.quantity = itemData.quantity;
            orderItem.price = menuItem.price; // Use current price
            orderItem.observation = itemData.observation || '';

            total += Number(menuItem.price) * itemData.quantity;
            order.items.push(orderItem);
        }

        order.total = total;

        return await this.orderRepository.save(order);
    }
}

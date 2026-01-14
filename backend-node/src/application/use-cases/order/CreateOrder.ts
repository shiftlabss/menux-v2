import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { IMenuRepository } from '@domain/repositories/IMenuRepository';
import { Order, OrderStatus } from '@domain/entities/Order';
import { OrderItem } from '@domain/entities/OrderItem';
import { AppError } from '../../../shared/errors';

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
}

export class CreateOrder {
    constructor(
        private orderRepository: IOrderRepository,
        private menuRepository: IMenuRepository
    ) { }

    async execute({ restaurantId, items, tableId, waiterId, customerName, tableNumber }: ICreateOrderRequest): Promise<Order> {
        if (!items || items.length === 0) {
            throw new AppError('Order must have at least one item.');
        }

        const order = new Order();
        order.restaurantId = restaurantId;
        order.status = OrderStatus.WAITING;
        order.customerName = String(customerName);
        order.tableNumber = String(tableNumber);

        // Generate a simple code for the order (e.g. timestamp based or just random for now)
        // In a real app we might want a sequential number per restaurant
        order.code = Math.floor(1000 + Math.random() * 9000).toString();

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

        // Optional: Customer Name/ID handling if we had it, for now implicit or stored elsewhere?
        // Customer entity is linked, but request might just have name. 
        // We'll skip creating a full Customer entity for this simple version unless strictly required.
        // If customerName is passed and no customerId, we could create an anonymous customer or similar, 
        // but let's stick to the core request first.

        return await this.orderRepository.save(order);
    }
}

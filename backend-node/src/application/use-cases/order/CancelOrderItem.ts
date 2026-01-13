import { IOrderRepository } from '@domain/repositories/IOrderRepository';
import { IWaiterRepository } from '@domain/repositories/IWaiterRepository';
import { AppError } from '../../../shared/errors';


interface ICancelOrderItemRequest {
    orderItemId: string;
    waiterId: string;
    restaurantId: string;
}

export class CancelOrderItem {
    constructor(
        private orderRepository: IOrderRepository,
        private waiterRepository: IWaiterRepository
    ) { }

    async execute({ orderItemId, waiterId, restaurantId }: ICancelOrderItemRequest): Promise<void> {
        // 1. Retrieve the Order Item (we need custom query to find by item ID directly or find order first)
        // Since standard repo might not have findOrderItemById, let's assume we search via Order or specialized method.
        // Usually, repositories are aggregate roots. So we might need to find the Order containing this item.
        // However, for efficiency, let's see if we can find the item directly or through order.
        // Let's assume we must find the Order first to ensure consistency and recalculate total.
        // But finding *which* order has this item is expensive without a direct lookup.
        // Let's treat IOrderRepository as capable of finding an order by one of its item's IDs or we find item first.

        // Actually, let's use a direct find on the item using the customized repository or query builder if not available.
        // Wait, IOrderRepository usually deals with Order.
        // Let's fetch the order that contains this item.
        // If the repository doesn't support "findByOrderItemId", we might need to add it or use a query.

        // For this implementation, I will assume we can fetch the OrderItem with its Order relation directly 
        // OR we use the OrderRepository to find the order.
        // Checking IOrderRepository capabilities...

        // Since I can't check the interface file right this second without a tool call, 
        // I will implement a helper or assume standard TypeORM repository capabilities if injected.
        // However, Clean Arch/DDD suggests using the Repository Interface.
        // Let's assume IOrderRepository has `findOrderByOrderItemId` or similar? Unlikely.
        // Let's try to find the OrderItem directly if possible, but that breaks Aggregate rule if OrderItem is not an aggregate.
        // Order is the aggregate. So we should load the Order.

        // Let's implement finding the order by passing the orderId? 
        // The request only said "passado o id do item".
        // So we must lookup the order.

        // I'll assume we can use the orderRepository to `findOne` where `items.id = orderItemId`.

        const order = await this.orderRepository.findByOrderItemId(orderItemId);

        if (!order) {
            throw new AppError('Order containing the item not found.', 404);
        }

        if (order.restaurantId !== restaurantId && order.restaurant?.id !== restaurantId) {
            throw new AppError('Order does not belong to this restaurant.', 403);
        }

        // 2. Retrieve Waiter and validate permissions
        const waiter = await this.waiterRepository.findById(waiterId);
        if (!waiter) {
            throw new AppError('Waiter not found.', 404);
        }

        if (waiter.restaurantId !== restaurantId) {
            throw new AppError('Waiter does not belong to this restaurant.', 403);
        }

        if (!waiter.canCancelItems) {
            throw new AppError('Waiter does not have permission to cancel items.', 403);
        }

        // 3. Find the specific item in the order
        const itemIndex = order.items.findIndex(i => i.id === orderItemId);
        if (itemIndex === -1) {
            throw new AppError('Item not found in order.', 404);
        }

        const item = order.items[itemIndex];

        if (item.status === 'CANCELED') {
            throw new AppError('Item is already canceled.', 400);
        }

        // 4. Update Item Status
        item.status = 'CANCELED';
        item.canceledAt = new Date();
        item.canceledBy = waiter;

        // 5. Recalculate Order Total
        // Only sum items that are NOT canceled
        const activeItems = order.items.filter(i => i.status !== 'CANCELED');
        const newTotal = activeItems.reduce((sum, currentItem) => {
            return sum + Number(currentItem.price) * currentItem.quantity;
        }, 0);

        order.total = newTotal;

        // 6. Save Order (Cascade should save item updates)
        await this.orderRepository.save(order);
    }
}

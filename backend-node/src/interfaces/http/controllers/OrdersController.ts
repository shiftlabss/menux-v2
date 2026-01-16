import { Request, Response, NextFunction } from 'express';
import { ConfirmOrderWithPin } from '@application/use-cases/order/ConfirmOrderWithPin';
import { ListOrdersByRestaurant } from '@application/use-cases/order/ListOrdersByRestaurant';
import { UpdateOrderStatus } from '@application/use-cases/order/UpdateOrderStatus';
import { ListOrdersByTable } from '@application/use-cases/order/ListOrdersByTable';
import { ListOrdersByWaiter } from '@application/use-cases/order/ListOrdersByWaiter';

import { CreateOrder } from '@application/use-cases/order/CreateOrder';
import { UpdateOrder } from '@application/use-cases/order/UpdateOrder';
import { ListCustomerOrders } from '@application/use-cases/order/ListCustomerOrders';

export class OrdersController {
    constructor(
        private confirmOrderWithPin: ConfirmOrderWithPin,
        private listOrders: ListOrdersByRestaurant,
        private updateOrderStatus: UpdateOrderStatus,
        private listOrdersByTable: ListOrdersByTable,
        private listOrdersByWaiter: ListOrdersByWaiter,
        private createOrder: CreateOrder,
        private updateOrder: UpdateOrder,
        private listCustomerOrders: ListCustomerOrders
    ) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { items, tableId, waiterId, customerName, transactionId } = req.body;
            // Allow restaurantId to be passed in body (for public/session) OR from auth user
            const restaurantId = req.body.restaurantId || (req as any).user?.restaurantId;

            if (!restaurantId) {
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }

            const order = await this.createOrder.execute({
                restaurantId,
                items,
                tableId,
                waiterId,
                customerName,
                transactionId
            });

            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { tableId, waiterId, status } = req.body;
            const restaurantId = (req as any).user?.restaurantId || req.body.restaurantId; // Assuming update might be done by waiter/admin

            if (!restaurantId) {
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }

            const order = await this.updateOrder.execute({
                orderId: id,
                restaurantId,
                tableId,
                waiterId,
                status
            });

            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { tableId, waiterId } = req.query;
            const restaurantId = (req.query.restaurantId || req.user?.restaurantId) as string;

            if (!restaurantId) {
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }

            let orders;

            if (tableId) {
                orders = await this.listOrdersByTable.execute(restaurantId, tableId as string);
            } else if (waiterId) {
                orders = await this.listOrdersByWaiter.execute(restaurantId, waiterId as string);
            } else {
                orders = await this.listOrders.execute(restaurantId);
            }

            res.json(orders);
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const restaurantId = req.user.restaurantId;

            const order = await this.updateOrderStatus.execute({
                orderId: id,
                status,
                restaurantId
            });

            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { pinCode } = req.body;
            const restaurantId = req.user.restaurantId;

            const order = await this.confirmOrderWithPin.execute({
                orderId: id,
                pinCode,
                restaurantId
            });

            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async listByCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { customerId } = req.params;
            const restaurantId = (req.query.restaurantId || req.body.restaurantId || (req as any).user?.restaurantId) as string;

            if (!restaurantId) {
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }

            const orders = await this.listCustomerOrders.execute({ customerId, restaurantId });
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }
}

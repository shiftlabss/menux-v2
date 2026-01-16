import { Request, Response, NextFunction } from 'express';
import { ConfirmOrderWithPin } from '@application/use-cases/order/ConfirmOrderWithPin';
import { ConfirmOrder } from '@application/use-cases/order/ConfirmOrder';
import { ListOrdersByRestaurant } from '@application/use-cases/order/ListOrdersByRestaurant';
import { UpdateOrderStatus } from '@application/use-cases/order/UpdateOrderStatus';
import { ListOrdersByTable } from '@application/use-cases/order/ListOrdersByTable';
import { ListOrdersByWaiter } from '@application/use-cases/order/ListOrdersByWaiter';

import { CreateOrder } from '@application/use-cases/order/CreateOrder';
import { UpdateOrder } from '@application/use-cases/order/UpdateOrder';
<<<<<<< HEAD
import { ListCustomerOrders } from '@application/use-cases/order/ListCustomerOrders';
import { ListTemporaryCustomerOrders } from '@application/use-cases/order/ListTemporaryCustomerOrders';
import { ListOrdersByDateRange } from '@application/use-cases/order/ListOrdersByDateRange';
import { ListSoldItemsByDateRange } from '@application/use-cases/order/ListSoldItemsByDateRange';
import { ListOrdersByRestaurantCompact } from '@application/use-cases/order/ListOrdersByRestaurantCompact';
import { GetOrderByCode } from '@application/use-cases/order/GetOrderByCode';
=======
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)

export class OrdersController {
    constructor(
        private confirmOrderWithPin: ConfirmOrderWithPin,
        private confirmOrder: ConfirmOrder,
        private listOrders: ListOrdersByRestaurant,
        private updateOrderStatus: UpdateOrderStatus,
        private listOrdersByTable: ListOrdersByTable,
        private listOrdersByWaiter: ListOrdersByWaiter,
        private createOrder: CreateOrder,
<<<<<<< HEAD
        private updateOrder: UpdateOrder,
        private listCustomerOrders: ListCustomerOrders,
        private listTemporaryCustomerOrders: ListTemporaryCustomerOrders,
        private listOrdersByDateRange: ListOrdersByDateRange,
        private listSoldItemsByDateRange: ListSoldItemsByDateRange,
        private listOrdersByRestaurantCompact: ListOrdersByRestaurantCompact,
        private getOrderByCode: GetOrderByCode,
        private cancelOrderItem: import('@application/use-cases/order/CancelOrderItem').CancelOrderItem
=======
        private updateOrder: UpdateOrder
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)
    ) { }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
<<<<<<< HEAD
            const { items, tableId, waiterId, customerName, transactionId, customerId, temporaryCustomerId, kpis } = req.body;
=======
            const { items, tableId, waiterId, customerName } = req.body;
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)
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
<<<<<<< HEAD
                customerName,
                transactionId,
                customerId,
                temporaryCustomerId,
                kpis
=======
                customerName
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)
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

    async listCompact(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const restaurantId = (req.query.restaurantId || req.user?.restaurantId) as string;
            // "option to return items" implies includeItems is selectable
            const { includeItems } = req.query;

            if (!restaurantId) {
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }

            // Defaults to true if not specified? Or false? 
            // "com a opção de retornar os items" -> typically optional usually means defaults to false or true. 
            // I'll default to true as it's often useful, or check if 'false' is passed.
            // Let's parse boolean properly.
            const shouldIncludeItems = includeItems !== 'false'; // Default to true if not explicitly 'false'

            const orders = await this.listOrdersByRestaurantCompact.execute(restaurantId, shouldIncludeItems);
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }

    async listByDateRange(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const restaurantId = (req.query.restaurantId || req.user?.restaurantId) as string;
            const { startDate, endDate, status } = req.query;

            if (!restaurantId) {
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }

            if (!startDate || !endDate) {
                res.status(400).json({ message: 'Start date and End date are required (YYYY-MM-DD)' });
                return;
            }

            const orders = await this.listOrdersByDateRange.execute(restaurantId, startDate as string, endDate as string, status as string);
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }

    async listSoldItems(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const restaurantId = (req.query.restaurantId || req.user?.restaurantId) as string;
            const { startDate, endDate, isSuggestion } = req.query;

            if (!restaurantId) {
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }

            if (!startDate || !endDate) {
                res.status(400).json({ message: 'Start date and End date are required (YYYY-MM-DD)' });
                return;
            }

            // transform 'true'/'false' string to boolean if present
            let suggestionFilter: boolean | undefined = undefined;
            if (isSuggestion === 'true') suggestionFilter = true;
            if (isSuggestion === 'false') suggestionFilter = false;

            const items = await this.listSoldItemsByDateRange.execute(restaurantId, startDate as string, endDate as string, suggestionFilter);
            res.json(items);
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

    async confirmByCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code, tableNumber, waiterName, waiterNickname } = req.body;
            const restaurantId = req.user.restaurantId;
            const waiterId = req.user.id; // From ensureAuthenticated

            const order = await this.confirmOrder.execute({
                code,
                restaurantId,
                tableNumber,
                waiterId,
                waiterName,
                waiterNickname
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

    async listByTemporaryCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { temporaryCustomerId } = req.params;
            const restaurantId = (req.query.restaurantId || req.body.restaurantId || (req as any).user?.restaurantId) as string;

            if (!restaurantId) {
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }

            const orders = await this.listTemporaryCustomerOrders.execute({ temporaryCustomerId, restaurantId });
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }

    async getByCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { code } = req.params;
            const restaurantId = (req.query.restaurantId || req.body.restaurantId || (req as any).user?.restaurantId) as string;

            if (!restaurantId) {
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }

            const order = await this.getOrderByCode.execute({
                code,
                restaurantId
            });

            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async cancelItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { itemId } = req.params;
            const { waiterId } = req.body;
            // restaurantId usually from user session, BUT if this is called by a waiter app it might be in token.
            // Assuming waiter endpoint authentication -> req.user.restaurantId
            const restaurantId = (req as any).user?.restaurantId;

            if (!restaurantId) {
                res.status(400).json({ message: 'Restaurant ID is required' });
                return;
            }
            if (!waiterId) {
                res.status(400).json({ message: 'Waiter ID is required' });
                return;
            }

            await this.cancelOrderItem.execute({
                orderItemId: itemId,
                waiterId,
                restaurantId
            });

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

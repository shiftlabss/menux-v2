import { Router } from 'express';
import { OrdersController } from '../controllers/OrdersController';
import { ConfirmOrderWithPin } from '@application/use-cases/order/ConfirmOrderWithPin';
import { ListOrdersByRestaurant } from '@application/use-cases/order/ListOrdersByRestaurant';
import { UpdateOrderStatus } from '@application/use-cases/order/UpdateOrderStatus';
import { ListOrdersByTable } from '@application/use-cases/order/ListOrdersByTable';
import { ListOrdersByWaiter } from '@application/use-cases/order/ListOrdersByWaiter';
import { TypeOrmOrderRepository } from '@infrastructure/repositories/TypeOrmOrderRepository';
import { TypeOrmWaiterRepository } from '@infrastructure/repositories/TypeOrmWaiterRepository';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const ordersRouter = Router();

// Dependencies
const orderRepository = new TypeOrmOrderRepository();
const waiterRepository = new TypeOrmWaiterRepository();
const confirmOrderWithPin = new ConfirmOrderWithPin(orderRepository, waiterRepository);
const listOrders = new ListOrdersByRestaurant(orderRepository);
const updateOrderStatus = new UpdateOrderStatus(orderRepository);
const listOrdersByTable = new ListOrdersByTable(orderRepository);
const listOrdersByWaiter = new ListOrdersByWaiter(orderRepository);

const ordersController = new OrdersController(
    confirmOrderWithPin,
    listOrders,
    updateOrderStatus,
    listOrdersByTable,
    listOrdersByWaiter
);

// pamploni - desativar o middleware de autenticação
// ordersRouter.use(ensureAuthenticated);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List all orders for the authenticated restaurant
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant ID (Optional if using Bearer Auth)
 *       - in: query
 *         name: tableId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter orders by table ID
 *       - in: query
 *         name: waiterId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter orders by waiter ID
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderResponse'
 */
ordersRouter.get('/', (req, res, next) => ordersController.index(req, res, next));

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update an order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [WAITING, PREPARING, READY, DELIVERED, FINISHED, CANCELED]
 *     responses:
 *       200:
 *         description: Status updated
 */
ordersRouter.patch('/:id/status', ensureAuthenticated, (req, res, next) => ordersController.updateStatus(req, res, next));

/**
 * @swagger
 * /orders/{id}/confirm:
 *   post:
 *     summary: Confirm an order using a waiter's PIN
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pinCode
 *             properties:
 *               pinCode:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: Order confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Invalid PIN code
 *       404:
 *         description: Order not found
 */
ordersRouter.post('/:id/confirm', ensureAuthenticated, (req, res, next) => ordersController.confirm(req, res, next));

export { ordersRouter };

import { Router } from 'express';
import { OrdersController } from '../controllers/OrdersController';
import { ConfirmOrderWithPin } from '@application/use-cases/order/ConfirmOrderWithPin';
import { ListOrdersByRestaurant } from '@application/use-cases/order/ListOrdersByRestaurant';
import { UpdateOrderStatus } from '@application/use-cases/order/UpdateOrderStatus';
import { ListOrdersByTable } from '@application/use-cases/order/ListOrdersByTable';
import { ListOrdersByWaiter } from '@application/use-cases/order/ListOrdersByWaiter';
import { CreateOrder } from '@application/use-cases/order/CreateOrder';
import { UpdateOrder } from '@application/use-cases/order/UpdateOrder';
import { TypeOrmOrderRepository } from '@infrastructure/repositories/TypeOrmOrderRepository';
import { TypeOrmWaiterRepository } from '@infrastructure/repositories/TypeOrmWaiterRepository';
import { TypeOrmMenuRepository } from '@infrastructure/repositories/TypeOrmMenuRepository';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const ordersRouter = Router();

// Dependencies
const orderRepository = new TypeOrmOrderRepository();
const waiterRepository = new TypeOrmWaiterRepository();
const menuRepository = new TypeOrmMenuRepository();

const confirmOrderWithPin = new ConfirmOrderWithPin(orderRepository, waiterRepository);
const listOrders = new ListOrdersByRestaurant(orderRepository);
const updateOrderStatus = new UpdateOrderStatus(orderRepository);
const listOrdersByTable = new ListOrdersByTable(orderRepository);
const listOrdersByWaiter = new ListOrdersByWaiter(orderRepository);
const createOrder = new CreateOrder(orderRepository, menuRepository);
const updateOrder = new UpdateOrder(orderRepository);

const ordersController = new OrdersController(
    confirmOrderWithPin,
    listOrders,
    updateOrderStatus,
    listOrdersByTable,
    listOrdersByWaiter,
    createOrder,
    updateOrder
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
 * /orders:
 *   post:
 *     summary: Create a new order with items
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *               - items
 *             properties:
 *               restaurantId:
 *                 type: string
 *                 format: uuid
 *               tableId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               waiterId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               customerName:
 *                 type: string
 *                 nullable: true
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - menuItemId
 *                     - quantity
 *                   properties:
 *                     menuItemId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                     observation:
 *                       type: string
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 */
ordersRouter.post('/', (req, res, next) => ordersController.create(req, res, next));

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order (e.g. assign table/waiter/status)
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
 *             properties:
 *               restaurantId:
 *                 type: string
 *                 format: uuid
 *                 description: Required for validation
 *               tableId:
 *                 type: string
 *                 format: uuid
 *               waiterId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [WAITING, PREPARING, READY, DELIVERED, FINISHED, CANCELED]
 *     responses:
 *       200:
 *         description: Order updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 */
ordersRouter.put('/:id', (req, res, next) => ordersController.update(req, res, next));

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

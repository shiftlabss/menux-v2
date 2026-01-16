import { Router } from 'express';
import { OrdersController } from '../controllers/OrdersController';
import { ConfirmOrderWithPin } from '@application/use-cases/order/ConfirmOrderWithPin';
import { ListOrdersByRestaurant } from '@application/use-cases/order/ListOrdersByRestaurant';
import { UpdateOrderStatus } from '@application/use-cases/order/UpdateOrderStatus';
import { ListOrdersByTable } from '@application/use-cases/order/ListOrdersByTable';
import { ListOrdersByWaiter } from '@application/use-cases/order/ListOrdersByWaiter';
import { CreateOrder } from '@application/use-cases/order/CreateOrder';
<<<<<<< HEAD
import { ConfirmOrder } from '@application/use-cases/order/ConfirmOrder';
import { UpdateOrder } from '@application/use-cases/order/UpdateOrder';
import { ListCustomerOrders } from '@application/use-cases/order/ListCustomerOrders';
import { ListTemporaryCustomerOrders } from '@application/use-cases/order/ListTemporaryCustomerOrders';
import { ListOrdersByDateRange } from '@application/use-cases/order/ListOrdersByDateRange';
import { ListSoldItemsByDateRange } from '@application/use-cases/order/ListSoldItemsByDateRange';
import { ListOrdersByRestaurantCompact } from '@application/use-cases/order/ListOrdersByRestaurantCompact';
import { GetOrderByCode } from '@application/use-cases/order/GetOrderByCode';
import { CancelOrderItem } from '@application/use-cases/order/CancelOrderItem';
import { RedisCacheAdapter } from '@infrastructure/cache/redis/RedisCacheAdapter';
import { TypeOrmOrderRepository } from '@infrastructure/repositories/TypeOrmOrderRepository';
import { TypeOrmWaiterRepository } from '@infrastructure/repositories/TypeOrmWaiterRepository';
import { TypeOrmMenuRepository } from '@infrastructure/repositories/TypeOrmMenuRepository';
import { TypeOrmDailyMetricRepository } from '@infrastructure/repositories/TypeOrmDailyMetricRepository';
import { TypeOrmTableRepository } from '@infrastructure/repositories/TypeOrmTableRepository';
import { UpdateRestaurantDailyMetrics } from '@application/use-cases/analytics/UpdateRestaurantDailyMetrics';
=======
import { UpdateOrder } from '@application/use-cases/order/UpdateOrder';
import { TypeOrmOrderRepository } from '@infrastructure/repositories/TypeOrmOrderRepository';
import { TypeOrmWaiterRepository } from '@infrastructure/repositories/TypeOrmWaiterRepository';
import { TypeOrmMenuRepository } from '@infrastructure/repositories/TypeOrmMenuRepository';
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { asyncHandler } from '@shared/utils/asyncHandler';

const ordersRouter = Router();

// Dependencies
const orderRepository = new TypeOrmOrderRepository();
const waiterRepository = new TypeOrmWaiterRepository();
<<<<<<< HEAD
const tableRepository = new TypeOrmTableRepository();
const menuRepository = new TypeOrmMenuRepository();
const cacheAdapter = new RedisCacheAdapter();
const dailyMetricRepository = new TypeOrmDailyMetricRepository();

const updateRestaurantDailyMetrics = new UpdateRestaurantDailyMetrics(dailyMetricRepository, orderRepository, cacheAdapter);

const confirmOrderWithPin = new ConfirmOrderWithPin(orderRepository, waiterRepository, updateRestaurantDailyMetrics);
const confirmOrder = new ConfirmOrder(orderRepository, tableRepository);
=======
const menuRepository = new TypeOrmMenuRepository();

const confirmOrderWithPin = new ConfirmOrderWithPin(orderRepository, waiterRepository);
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)
const listOrders = new ListOrdersByRestaurant(orderRepository);
const updateOrderStatus = new UpdateOrderStatus(orderRepository, updateRestaurantDailyMetrics);
const listOrdersByTable = new ListOrdersByTable(orderRepository);
const listOrdersByWaiter = new ListOrdersByWaiter(orderRepository);
<<<<<<< HEAD
const createOrder = new CreateOrder(orderRepository, menuRepository, cacheAdapter, updateRestaurantDailyMetrics);
const updateOrder = new UpdateOrder(orderRepository, updateRestaurantDailyMetrics);
const listCustomerOrders = new ListCustomerOrders(orderRepository);


const listTemporaryCustomerOrders = new ListTemporaryCustomerOrders(orderRepository);
const listOrdersByDateRange = new ListOrdersByDateRange(orderRepository);
const listSoldItemsByDateRange = new ListSoldItemsByDateRange(orderRepository);
const listOrdersByRestaurantCompact = new ListOrdersByRestaurantCompact(orderRepository);
const getOrderByCode = new GetOrderByCode(orderRepository);
const cancelOrderItem = new CancelOrderItem(orderRepository, waiterRepository);
=======
const createOrder = new CreateOrder(orderRepository, menuRepository);
const updateOrder = new UpdateOrder(orderRepository);
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)

const ordersController = new OrdersController(
    confirmOrderWithPin,
    confirmOrder,
    listOrders,
    updateOrderStatus,
    listOrdersByTable,
    listOrdersByWaiter,
    createOrder,
<<<<<<< HEAD
    updateOrder,
    listCustomerOrders,
    listTemporaryCustomerOrders,
    listOrdersByDateRange,
    listSoldItemsByDateRange,
    listOrdersByRestaurantCompact,
    getOrderByCode,
    cancelOrderItem
=======
    updateOrder
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)
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
 * /orders/compact:
 *   get:
 *     summary: List orders by restaurant (compact mode)
 *     description: Returns orders for a restaurant. Optimized for performance by excluding heavy image data.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: includeItems
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Whether to include order items (default true). Items will NOT contain base64 image data.
 *     responses:
 *       200:
 *         description: List of orders (compact)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderResponse'
 */
ordersRouter.get('/compact', ensureAuthenticated, asyncHandler((req, res, next) => ordersController.listCompact(req, res, next)));

/**
 * @swagger
 * /orders/history:
 *   get:
 *     summary: List orders by date range
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start Date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End Date (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional status filter
 *     responses:
 *       200:
 *         description: List of orders within range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderResponse'
 */
ordersRouter.get('/history', ensureAuthenticated, asyncHandler((req, res, next) => ordersController.listByDateRange(req, res, next)));

/**
 * @swagger
 * /orders/items/history:
 *   get:
 *     summary: List sold items by date range
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start Date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End Date (YYYY-MM-DD)
 *       - in: query
 *         name: isSuggestion
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter by suggested items (true/false)
 *     responses:
 *       200:
 *         description: List of sold items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   total:
 *                     type: number
 */
ordersRouter.get('/items/history', ensureAuthenticated, asyncHandler((req, res, next) => ordersController.listSoldItems(req, res, next)));

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
ordersRouter.get('/', asyncHandler((req, res, next) => ordersController.index(req, res, next)));

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
 *               transactionId:
 *                 type: string
 *                 format: uuid
 *                 description: Unique client-generated ID for idempotency
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
 *                     decisionTime:
 *                       type: integer
 *                       description: Time in seconds spent deciding on this item
 *                     isSuggestion:
 *                       type: boolean
 *                       description: Indicates if item was added via suggestion
 *                     suggestionType:
 *                       type: string
 *                       description: Type of suggestion (e.g. cross-sell, upsell)
 *                     options:
 *                       type: object
 *                       additionalProperties: true
 *                       description: 'Flexible options like size (e.g. { "size": "P" })'
 *                     composition:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - menuItemId
 *                           - groupKey
 *                         properties:
 *                           menuItemId:
 *                             type: string
 *                             format: uuid
 *                           groupKey:
 *                             type: string
 *                           quantity:
 *                             type: integer
 *                             default: 1
 *               kpis:
 *                 type: object
 *                 properties:
 *                   totalDecisionTime:
 *                     type: integer
 *                     description: Total time in seconds spent on the order
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 */
ordersRouter.post('/', asyncHandler((req, res, next) => ordersController.create(req, res, next)));

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
ordersRouter.put('/:id', asyncHandler((req, res, next) => ordersController.update(req, res, next)));

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
ordersRouter.patch('/:id/status', ensureAuthenticated, asyncHandler((req, res, next) => ordersController.updateStatus(req, res, next)));

/**
 * @swagger
 * /orders/items/{itemId}/cancel:
 *   patch:
 *     summary: Cancel an order item
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
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
 *               - waiterId
 *             properties:
 *               waiterId:
 *                 type: string
 *                 format: uuid
 *                 description: Waiter ID attempting to cancel
 *     responses:
 *       204:
 *         description: Item canceled successfully
 *       403:
 *         description: Waiter not authorized
 *       404:
 *         description: Item or Waiter not found
 */
ordersRouter.patch('/items/:itemId/cancel', ensureAuthenticated, asyncHandler((req, res, next) => ordersController.cancelItem(req, res, next)));

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
ordersRouter.post('/:id/confirm', ensureAuthenticated, asyncHandler((req, res, next) => ordersController.confirm(req, res, next)));

/**
 * @swagger
 * /orders/confirm-by-code:
 *   post:
 *     summary: Confirm an order using the order code
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - tableNumber
 *             properties:
 *               code:
 *                 type: string
 *                 description: Order code (e.g. from table QR)
 *               tableNumber:
 *                 type: integer
 *                 description: Table number to associate/check
 *               waiterName:
 *                 type: string
 *                 description: Name of the waiter confirming
 *               waiterNickname:
 *                 type: string
 *                 description: Nickname of the waiter confirming
 *     responses:
 *       200:
 *         description: Order confirmed and updated status returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Order not in waiting status
 *       404:
 *         description: Order not found
 */
ordersRouter.post('/confirm-by-code', ensureAuthenticated, asyncHandler((req, res, next) => ordersController.confirmByCode(req, res, next)));

/**
 * @swagger
 * /orders/code/{code}:
 *   get:
 *     summary: Get order details by code
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Order Code
 *       - in: query
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       404:
 *         description: Order not found
 */
ordersRouter.get('/code/:code', asyncHandler((req, res, next) => ordersController.getByCode(req, res, next)));

/**
 * @swagger
 * /orders/customer/{customerId}:
 *   get:
 *     summary: List all orders for a specific customer in the last 24 hours
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of cutomer's orders in last 24h
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderResponse'
 */
ordersRouter.get('/customer/:customerId', asyncHandler((req, res, next) => ordersController.listByCustomer(req, res, next)));

/**
 * @swagger
 * /orders/temporary-customer/{temporaryCustomerId}:
 *   get:
 *     summary: List orders for a temporary customer in the last 24 hours
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: temporaryCustomerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Temporary Customer ID (e.g. from localStorage)
 *       - in: query
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: List of temporary customer's orders in last 24h
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderResponse'
 */
ordersRouter.get('/temporary-customer/:temporaryCustomerId', asyncHandler((req, res, next) => ordersController.listByTemporaryCustomer(req, res, next)));

export { ordersRouter };

import { Router } from 'express';
import { TablesController } from '../controllers/TablesController';
import { CreateTable } from '@application/use-cases/table/CreateTable';
import { UpdateTable } from '@application/use-cases/table/UpdateTable';
import { DeleteTable } from '@application/use-cases/table/DeleteTable';
import { ListTablesWithSummary } from '@application/use-cases/table/ListTablesWithSummary';
import { ListTablesByWaiter } from '@application/use-cases/table/ListTablesByWaiter';
import { TypeOrmTableRepository } from '@infrastructure/repositories/TypeOrmTableRepository';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { resolveRestaurantBySlug } from '../middlewares/resolveRestaurantBySlug';
import { asyncHandler } from '@shared/utils/asyncHandler';
import { TypeOrmRestaurantRepository } from '@infrastructure/repositories/TypeOrmRestaurantRepository';
import { TransferTableOrders } from '@application/use-cases/table/TransferTableOrders';
import { TypeOrmOrderRepository } from '@infrastructure/repositories/TypeOrmOrderRepository';
import { TypeOrmWaiterRepository } from '@infrastructure/repositories/TypeOrmWaiterRepository';
import { BCryptHashProvider } from '@infrastructure/providers/BCryptHashProvider';
import { ChangeTableStatus } from '@application/use-cases/table/ChangeTableStatus';
import { ReleaseTable } from '@application/use-cases/table/ReleaseTable';
import { ReleaseTableByNumber } from '@application/use-cases/table/ReleaseTableByNumber';

const tablesRouter = Router();

// Dependencies
const tableRepository = new TypeOrmTableRepository();
const restaurantRepository = new TypeOrmRestaurantRepository();
const createTable = new CreateTable(tableRepository);
const updateTable = new UpdateTable(tableRepository);
const deleteTable = new DeleteTable(tableRepository);
const listTables = new ListTablesWithSummary(tableRepository);
const listTablesByWaiter = new ListTablesByWaiter(tableRepository);
const orderRepository = new TypeOrmOrderRepository();
const waiterRepository = new TypeOrmWaiterRepository();
const hashProvider = new BCryptHashProvider();

const transferTableOrders = new TransferTableOrders(
    orderRepository,
    tableRepository,
    waiterRepository,
    hashProvider
);

const changeTableStatus = new ChangeTableStatus(
    orderRepository,
    tableRepository,
    waiterRepository,
    hashProvider
);

const releaseTable = new ReleaseTable(tableRepository, orderRepository);
const releaseTableByNumber = new ReleaseTableByNumber(tableRepository, orderRepository);

const tablesController = new TablesController(
    createTable,
    updateTable,
    deleteTable,
    listTables,
    listTablesByWaiter,
    transferTableOrders,
    changeTableStatus,
    releaseTable,
    releaseTableByNumber
);

// tablesRouter.use(ensureAuthenticated);

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Table management
 */

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: List tables by restaurant
 *     tags: [Tables]
 *     parameters:
 *       - in: query
 *         name: waiterId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter tables by assigned waiter ID
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [FREE, OCCUPIED, CLOSING, CLOSED]
 *         description: Filter tables by status
 *       - in: query
 *         name: priority
 *         required: false
 *         schema:
 *           type: string
 *           enum: [MEDIUM, HIGH]
 *         description: Filter tables by priority
 *     responses:
 *       200:
 *         description: List of tables
 *   post:
 *     summary: Create a new table
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *             properties:
 *               number:
 *                 type: integer
 *               capacity:
 *                 type: integer
 */
tablesRouter.get('/', resolveRestaurantBySlug(restaurantRepository), asyncHandler(async (req, res, next) => {
    // If restaurantId is present (from slug or query), allow access
    if (req.query.restaurantId) {
        return tablesController.index(req, res, next);
    }
    // Otherwise fallback to auth
    ensureAuthenticated(req, res, (err) => {
        if (err) throw err;
    });

    return tablesController.index(req, res, next);
}));
tablesRouter.post('/', ensureAuthenticated, asyncHandler((req, res, next) => tablesController.create(req, res, next)));

/**
 * @swagger
 * /tables/transfer:
 *   post:
 *     summary: Transfer orders from one table to another
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceTableNumber
 *               - destinationTableNumber
 *               - waiterCode
 *             properties:
 *               sourceTableNumber:
 *                 type: integer
 *               destinationTableNumber:
 *                 type: integer
 *               waiterCode:
 *                 type: string
 *               waiterPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Orders transferred successfully
 *       400:
 *         description: Bad request (e.g. invalid status, waiter permission)
 */
tablesRouter.post('/transfer', resolveRestaurantBySlug(restaurantRepository), asyncHandler((req, res, next) => tablesController.transfer(req, res, next)));

/**
 * @swagger
 * /tables/status:
 *   patch:
 *     summary: Change table status (Close/Occupied)
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tableNumber
 *               - status
 *               - waiterCode
 *             properties:
 *               tableNumber:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [CLOSED, OCCUPIED]
 *               waiterCode:
 *                 type: string
 *               waiterPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad request (e.g. invalid status, waiter permission)
 */
tablesRouter.patch('/status', resolveRestaurantBySlug(restaurantRepository), asyncHandler((req, res, next) => tablesController.changeStatus(req, res, next)));

/**
 * @swagger
 * /tables/{id}:
 *   put:
 *     summary: Update a table
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Table updated
 *   delete:
 *     summary: Delete a table
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Table deleted
 */
tablesRouter.put('/:id', ensureAuthenticated, asyncHandler((req, res, next) => tablesController.update(req, res, next)));
tablesRouter.delete('/:id', ensureAuthenticated, asyncHandler((req, res, next) => tablesController.delete(req, res, next)));

/**
 * @swagger
 * /tables/{id}/release:
 *   post:
 *     summary: Release (free) a table and finish its orders
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Table released successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       404:
 *         description: Table not found
 */
tablesRouter.post('/:id/release', ensureAuthenticated, asyncHandler((req, res, next) => tablesController.release(req, res, next)));

/**
 * @swagger
 * /tables/{number}/release-by-number:
 *   post:
 *     summary: Release (free) a table by its number
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Table number
 *     responses:
 *       200:
 *         description: Table released successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Table'
 *       404:
 *         description: Table not found
 */
tablesRouter.post('/:number/release-by-number', ensureAuthenticated, asyncHandler((req, res, next) => tablesController.releaseByNumber(req, res, next)));

export { tablesRouter };

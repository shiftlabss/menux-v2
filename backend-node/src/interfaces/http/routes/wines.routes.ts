import { Router } from 'express';
import { WinesController } from '../controllers/WinesController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { asyncHandler } from '@shared/utils/asyncHandler';

const winesRouter = Router();
const winesController = new WinesController();

/**
 * @swagger
 * tags:
 *   name: Wines
 *   description: Wine menu management
 */

/**
 * @swagger
 * /wines:
 *   get:
 *     summary: List all wines in the default wine category
 *     tags: [Wines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wines
 */
winesRouter.get('/', ensureAuthenticated, asyncHandler(winesController.index));

/**
 * @swagger
 * /wines/categories:
 *   get:
 *     summary: List all subcategories of the default wine category
 *     tags: [Wines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wine subcategories
 */
winesRouter.get('/categories', ensureAuthenticated, asyncHandler(winesController.listCategories));

export { winesRouter };

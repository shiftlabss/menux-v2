import { Router } from 'express';
import { RestaurantsController } from '../controllers/RestaurantsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { asyncHandler } from '@shared/utils/asyncHandler';

const restaurantsRouter = Router();
const restaurantsController = new RestaurantsController();

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant settings management
 */

/**
 * @swagger
 * /restaurants/me:
 *   get:
 *     summary: Get current restaurant settings
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restaurant settings
 */
restaurantsRouter.get('/me', ensureAuthenticated, asyncHandler(restaurantsController.show));

/**
 * @swagger
 * /restaurants/me:
 *   put:
 *     summary: Update current restaurant settings
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               tradingName:
 *                 type: string
 *               corporateName:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               headerUrl:
 *                 type: string
 *               description:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               openingHours:
 *                 type: string
 *               instagram:
 *                 type: string
 *               facebook:
 *                 type: string
 *               whatsapp:
 *                 type: string
 *               website:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant updated
 */
restaurantsRouter.put('/me', ensureAuthenticated, asyncHandler(restaurantsController.update));

/**
 * @swagger
 * /restaurants/{slug}:
 *   get:
 *     summary: Get restaurant by slug
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Restaurant slug
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Restaurant not found
 */
restaurantsRouter.get('/:slug', asyncHandler(restaurantsController.showBySlug));

export { restaurantsRouter };

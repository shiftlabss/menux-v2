import { Router } from 'express';
import { SystemParametersController } from '../controllers/SystemParametersController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { asyncHandler } from '@shared/utils/asyncHandler';

const systemParametersRouter = Router();
const controller = new SystemParametersController();

/**
 * @swagger
 * tags:
 *   name: SystemParameters
 *   description: System-wide configuration parameters
 */

/**
 * @swagger
 * /system-parameters:
 *   get:
 *     summary: Get system parameters for the authenticated restaurant
 *     tags: [SystemParameters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System parameters
 */
systemParametersRouter.get('/', ensureAuthenticated, asyncHandler(controller.show));

/**
 * @swagger
 * /system-parameters:
 *   patch:
 *     summary: Update system parameters
 *     tags: [SystemParameters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pizzaCategoryId:
 *                 type: string
 *                 format: uuid
 *               wineCategoryId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Updated parameters
 */
systemParametersRouter.patch('/', ensureAuthenticated, asyncHandler(controller.update));

export { systemParametersRouter };

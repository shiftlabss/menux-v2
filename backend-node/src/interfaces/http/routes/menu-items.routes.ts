import { Router } from 'express';
import { MenuItemsController } from '../controllers/MenuItemsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { asyncHandler } from '@shared/utils/asyncHandler';


const menuItemsRouter = Router();
const menuItemsController = new MenuItemsController();

/**
 * @swagger
 * tags:
 *   name: MenuItems
 *   description: Menu item management
 */

/**
 * @swagger
 * /menu-items:
 *   get:
 *     summary: List menu items
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of items
 */
menuItemsRouter.get('/', ensureAuthenticated, asyncHandler(menuItemsController.index));


/**
 * @swagger
 * /menu-items/{id}:
 *   get:
 *     summary: Get menu item details
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Item details
 */
menuItemsRouter.get('/:id', ensureAuthenticated, asyncHandler(menuItemsController.show));

/**
 * @swagger
 * /menu-items/getItem/{id}:
 *   get:
 *     summary: Get menu item details
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Menu item details
 *       404:
 *         description: Item not found
 */
menuItemsRouter.get('/getItem/:id', asyncHandler(menuItemsController.show));

/**
 * @swagger
 * /menu-items:
 *   post:
 *     summary: Create new menu item
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               isActive:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *               allergens:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               menuId:
 *                 type: string
 *                 format: uuid
 *               optionsConfig:
 *                 type: object
 *               menuType:
 *                 type: string
 *                 enum: [PRODUCT, WINE, PIZZA]
 *               vintage:
 *                 type: string
 *                 description: Wine vintage year
 *               country:
 *                 type: string
 *                 description: Wine country of origin
 *               winery:
 *                 type: string
 *                 description: Wine producer
 *               grape:
 *                 type: string
 *                 description: Grape varieties
 *               region:
 *                 type: string
 *                 description: Wine region
 *               style:
 *                 type: string
 *                 description: Wine style (e.g., Tinto Encorpado)
 *               glassPrice:
 *                 type: number
 *                 description: Price per glass
 *     responses:
 *       201:
 *         description: Item created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 options:
 *                   type: array
 *                 optionsConfig:
 *                   type: object
 */
menuItemsRouter.post('/', ensureAuthenticated, asyncHandler(menuItemsController.create));

/**
 * @swagger
 * /menu-items/{id}:
 *   put:
 *     summary: Update menu item
 *     tags: [MenuItems]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               isActive:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *               allergens:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               menuId:
 *                 type: string
 *                 format: uuid
 *               optionsConfig:
 *                 type: object
 *                 description: JSON configuration for option groups and items
 *               menuType:
 *                 type: string
 *                 enum: [PRODUCT, WINE, PIZZA]
 *               vintage:
 *                 type: string
 *               country:
 *                 type: string
 *               winery:
 *                 type: string
 *               grape:
 *                 type: string
 *               region:
 *                 type: string
 *               style:
 *                 type: string
 *               glassPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The updated menu item including options entities
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 options:
 *                   type: array
 *                   description: Array of saved MenuItemOption entities
 *                 optionsConfig:
 *                   type: object
 */
menuItemsRouter.put('/:id', ensureAuthenticated, asyncHandler(menuItemsController.update));

/**
 * @swagger
 * /menu-items/{id}:
 *   delete:
 *     summary: Delete menu item
 *     tags: [MenuItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Item deleted
 */
menuItemsRouter.delete('/:id', ensureAuthenticated, asyncHandler(menuItemsController.delete));

/**
 * @swagger
 * /menu-items/search/tags:
 *   get:
 *     summary: Search menu items by tags
 *     tags: [MenuItems]
 *     parameters:
 *       - in: query
 *         name: tags
 *         schema:
 *           oneOf:
 *             - type: string
 *             - type: array
 *               items:
 *                 type: string
 *         description: Tags to search for (comma separated or multiple params)
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Restaurant ID (Optional if authenticated)
 *     responses:
 *       200:
 *         description: List of items matching tags
 */
menuItemsRouter.get('/search/tags', asyncHandler(menuItemsController.filterByTags));

export { menuItemsRouter };

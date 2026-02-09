import { Router } from 'express';
import { CategoriesController } from '../controllers/CategoriesController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { asyncHandler } from '@shared/utils/asyncHandler';

const categoriesRouter = Router();
const categoriesController = new CategoriesController();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *               order:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *               pai:
 *                 type: string
 *                 format: uuid
 *               restaurantId:
 *                 type: string
 *                 format: uuid
 *               isComposition:
 *                 type: boolean
 *               isVisible:
 *                 type: boolean
 *               canPriceBeZero:
 *                 type: boolean
 *               maxChoices:
 *                 type: integer
 *               isOptional:
 *                 type: boolean
 *               priceRule:
 *                 type: string
 *                 enum: [SUM, AVERAGE, HIGHEST, NONE]
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 */
categoriesRouter.post('/', ensureAuthenticated, asyncHandler(categoriesController.create));

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResponse'
 */
categoriesRouter.get('/', ensureAuthenticated, asyncHandler(categoriesController.index));

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
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
 *         description: Category found
 *       404:
 *         description: Category not found
 */
categoriesRouter.get('/:id', ensureAuthenticated, asyncHandler(categoriesController.show));

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
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
 *               order:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *               pai:
 *                 type: string
 *                 format: uuid
 *               isComposition:
 *                 type: boolean
 *               isVisible:
 *                 type: boolean
 *               canPriceBeZero:
 *                 type: boolean
 *               maxChoices:
 *                 type: integer
 *               isOptional:
 *                 type: boolean
 *               priceRule:
 *                 type: string
 *                 enum: [SUM, AVERAGE, HIGHEST, NONE]
 *     responses:
 *       200:
 *         description: Category updated
 */
categoriesRouter.put('/:id', ensureAuthenticated, asyncHandler(categoriesController.update));

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
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
 *         description: Category deleted
 *       400:
 *         description: Cannot delete category (e.g. has subcategories)
 */
categoriesRouter.delete('/:id', ensureAuthenticated, asyncHandler(categoriesController.delete));

/**
 * @swagger
 * /categories/reorder:
 *   post:
 *     summary: Reorder categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       204:
 *         description: Categories reordered
 */
categoriesRouter.post('/reorder', ensureAuthenticated, asyncHandler(categoriesController.reorder));

// --- Category Groups (Composition Links) ---
import { CategoryGroupsController } from '../controllers/CategoryGroupsController';
const categoryGroupsController = new CategoryGroupsController();

/**
 * @swagger
 * /categories/{categoryId}/groups:
 *   get:
 *     summary: List composition groups showing linked composition categories
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of category groups
 */
categoriesRouter.get('/:categoryId/groups', ensureAuthenticated, asyncHandler(categoryGroupsController.index));

/**
 * @swagger
 * /categories/{categoryId}/groups:
 *   post:
 *     summary: Add a composition category group to this category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - compositionCategoryId
 *             properties:
 *               compositionCategoryId:
 *                 type: string
 *               min:
 *                 type: integer
 *               max:
 *                 type: integer
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Group link created
 */
categoriesRouter.post('/:categoryId/groups', ensureAuthenticated, asyncHandler(categoryGroupsController.store));

/**
 * @swagger
 * /categories/groups/{id}:
 *   put:
 *     summary: Update a category group link
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               min:
 *                 type: integer
 *               max:
 *                 type: integer
 *               order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Group link updated
 */
categoriesRouter.put('/groups/:id', ensureAuthenticated, asyncHandler(categoryGroupsController.update));

/**
 * @swagger
 * /categories/groups/{id}:
 *   delete:
 *     summary: Remove a category group link
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Group link removed
 */
categoriesRouter.delete('/groups/:id', ensureAuthenticated, asyncHandler(categoryGroupsController.delete));

export { categoriesRouter };

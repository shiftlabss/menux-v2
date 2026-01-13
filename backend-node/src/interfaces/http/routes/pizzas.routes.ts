import { Router } from 'express';
import { PizzasController } from '../controllers/PizzasController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { asyncHandler } from '@shared/utils/asyncHandler';

const pizzasRouter = Router();
const pizzasController = new PizzasController();

// Lists
pizzasRouter.get('/', ensureAuthenticated, asyncHandler(pizzasController.index));
pizzasRouter.get('/categories', ensureAuthenticated, asyncHandler(pizzasController.listCategories));
pizzasRouter.get('/composition-categories', ensureAuthenticated, asyncHandler(pizzasController.listCompositionCategories));

// CRUD Items
pizzasRouter.post('/', ensureAuthenticated, asyncHandler(pizzasController.store));
pizzasRouter.put('/:id', ensureAuthenticated, asyncHandler(pizzasController.store)); // reuse store for update logic
pizzasRouter.patch('/:id/status', ensureAuthenticated, asyncHandler(pizzasController.toggleStatus));

// Settings - Crusts
pizzasRouter.get('/settings/crusts', ensureAuthenticated, asyncHandler(pizzasController.listCrusts));
pizzasRouter.post('/settings/crusts', ensureAuthenticated, asyncHandler(pizzasController.createCrust));
pizzasRouter.patch('/settings/crusts/:id', ensureAuthenticated, asyncHandler(pizzasController.updateCrust));
pizzasRouter.delete('/settings/crusts/:id', ensureAuthenticated, asyncHandler(pizzasController.deleteCrust));
pizzasRouter.patch('/settings/crusts/:id/status', ensureAuthenticated, asyncHandler(pizzasController.toggleCrustStatus));

// Settings - Doughs
pizzasRouter.get('/settings/doughs', ensureAuthenticated, asyncHandler(pizzasController.listDoughs));
pizzasRouter.post('/settings/doughs', ensureAuthenticated, asyncHandler(pizzasController.createDough));
pizzasRouter.patch('/settings/doughs/:id', ensureAuthenticated, asyncHandler(pizzasController.updateDough));
pizzasRouter.delete('/settings/doughs/:id', ensureAuthenticated, asyncHandler(pizzasController.deleteDough));
pizzasRouter.patch('/settings/doughs/:id/status', ensureAuthenticated, asyncHandler(pizzasController.toggleDoughStatus));

// Settings - Addons
pizzasRouter.get('/settings/addon-groups', ensureAuthenticated, asyncHandler(pizzasController.listAddons));
pizzasRouter.post('/settings/addons', ensureAuthenticated, asyncHandler(pizzasController.createAddonItem));
pizzasRouter.patch('/settings/addons/:id', ensureAuthenticated, asyncHandler(pizzasController.updateAddonItem));
pizzasRouter.delete('/settings/addons/:id', ensureAuthenticated, asyncHandler(pizzasController.deleteAddonItem));
pizzasRouter.patch('/settings/addons/:id/status', ensureAuthenticated, asyncHandler(pizzasController.toggleAddonItemStatus));


export { pizzasRouter };

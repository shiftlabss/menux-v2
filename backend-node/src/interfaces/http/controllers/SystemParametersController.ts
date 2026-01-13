import { Request, Response, NextFunction } from 'express';
import { TypeOrmSystemParameterRepository } from '../../../infrastructure/repositories/TypeOrmSystemParameterRepository';
import { GetSystemParameters } from '../../../application/use-cases/system-parameters/GetSystemParameters';
import { UpdateSystemParameters } from '../../../application/use-cases/system-parameters/UpdateSystemParameters';

import { logActivity } from '@shared/utils/auditLogger';

export class SystemParametersController {
    public show = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const restaurantId = req.user?.restaurantId;

            if (!restaurantId) {
                return res.status(400).json({ message: 'Restaurant ID is required' });
            }

            const repo = new TypeOrmSystemParameterRepository();
            const getSystemParameters = new GetSystemParameters(repo);

            const parameters = await getSystemParameters.execute(restaurantId);

            return res.json(parameters || { restaurantId, pizzaCategoryId: null, wineCategoryId: null });
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const restaurantId = req.user?.restaurantId;
            const { pizzaCategoryId, wineCategoryId } = req.body;

            if (!restaurantId) {
                return res.status(400).json({ message: 'Restaurant ID is required' });
            }

            const repo = new TypeOrmSystemParameterRepository();
            // Fetch old data for audit log
            const getSystemParameters = new GetSystemParameters(repo);
            const oldParameters = await getSystemParameters.execute(restaurantId);

            const updateSystemParameters = new UpdateSystemParameters(repo);

            const parameters = await updateSystemParameters.execute({
                restaurantId,
                pizzaCategoryId,
                wineCategoryId
            });

            if (req.user?.id) {
                await logActivity(
                    req.user.id,
                    'UPDATE',
                    'SystemParameters',
                    'Updated system parameters',
                    parameters.id,
                    {
                        oldValue: oldParameters,
                        newValue: parameters
                    },
                    req
                );
            }

            return res.json(parameters);
        } catch (error) {
            next(error);
        }
    };
}

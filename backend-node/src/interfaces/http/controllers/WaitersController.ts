import { Request, Response, NextFunction } from 'express';
import { TypeOrmWaiterRepository } from '@infrastructure/repositories/TypeOrmWaiterRepository';
import { CreateWaiter } from '@application/use-cases/waiter/CreateWaiter';
import { UpdateWaiter } from '@application/use-cases/waiter/UpdateWaiter';
import { DeleteWaiter } from '@application/use-cases/waiter/DeleteWaiter';
import { ListWaitersByRestaurant } from '@application/use-cases/waiter/ListWaitersByRestaurant';
import { GetWaiterDetails } from '@application/use-cases/waiter/GetWaiterDetails';
import { AuthenticateWaiter } from '@application/use-cases/waiter/AuthenticateWaiter';
import { BCryptHashProvider } from '@infrastructure/providers/BCryptHashProvider';
import { JwtTokenProvider } from '@infrastructure/providers/JwtTokenProvider';


import { logActivity } from '@shared/utils/auditLogger';

export class WaitersController {
    public login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const { pinCode, password, restaurantId } = req.body;
            // If restaurantId is not in body, maybe try to resolve from slug middleware if applied?
            // But login is usually public. If public, need explicit restaurantId.

            const waiterRepository = new TypeOrmWaiterRepository();
            const hashProvider = new BCryptHashProvider();
            const tokenProvider = new JwtTokenProvider();

            const authenticateWaiter = new AuthenticateWaiter(
                waiterRepository,
                hashProvider,
                tokenProvider
            );

            const result = await authenticateWaiter.execute({
                pinCode,
                password,
                restaurantId
            });

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }

    public create = async (req: Request, res: Response): Promise<Response> => {
        const { name, nickname, avatarUrl, pinCode, password } = req.body;
        const restaurantId = req.user.restaurantId;

        const waiterRepository = new TypeOrmWaiterRepository();
        const hashProvider = new BCryptHashProvider();
        const createWaiter = new CreateWaiter(waiterRepository, hashProvider);

        const waiter = await createWaiter.execute({
            name,
            nickname,
            avatarUrl,
            pinCode,
            password,
            restaurantId,
        });

        if (req.user?.id) {
            await logActivity(
                req.user.id,
                'CREATE',
                'Waiter',
                `Created waiter: ${waiter.name}`,
                waiter.id,
                { ...waiter },
                req
            );
        }

        return res.status(201).json(waiter);
    }

    public update = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const data = req.body;

        const waiterRepository = new TypeOrmWaiterRepository();
        const hashProvider = new BCryptHashProvider();
        const updateWaiter = new UpdateWaiter(waiterRepository, hashProvider);

        // Fetch old data for audit log
        const oldWaiter = await waiterRepository.findById(id);

        const waiter = await updateWaiter.execute({
            id,
            ...data,
        });

        if (req.user?.id) {
            await logActivity(
                req.user.id,
                'UPDATE',
                'Waiter',
                `Updated waiter: ${waiter.name}`,
                waiter.id,
                {
                    oldValue: oldWaiter,
                    newValue: waiter
                },
                req
            );
        }

        return res.json(waiter);
    }

    public index = async (req: Request, res: Response): Promise<Response> => {
        const restaurantId = req.user.restaurantId;

        const waiterRepository = new TypeOrmWaiterRepository();
        const listWaiters = new ListWaitersByRestaurant(waiterRepository);

        const waiters = await listWaiters.execute(restaurantId);

        return res.json(waiters);
    }

    public show = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;

        const waiterRepository = new TypeOrmWaiterRepository();
        const getWaiter = new GetWaiterDetails(waiterRepository);

        const waiter = await getWaiter.execute(id);

        return res.json(waiter);
    }

    public delete = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;

        const waiterRepository = new TypeOrmWaiterRepository();
        const deleteWaiter = new DeleteWaiter(waiterRepository);

        await deleteWaiter.execute(id);

        if (req.user?.id) {
            await logActivity(
                req.user.id,
                'DELETE',
                'Waiter',
                `Deleted waiter with ID: ${id}`,
                id,
                null,
                req
            );
        }

        return res.status(204).send();
    }
}

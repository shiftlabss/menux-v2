import { Request, Response } from 'express';
import { TypeOrmRestaurantRepository } from '@infrastructure/repositories/TypeOrmRestaurantRepository';
import { GetRestaurant } from '@application/use-cases/restaurant/GetRestaurant';
import { UpdateRestaurant } from '@application/use-cases/restaurant/UpdateRestaurant';

export class RestaurantsController {
    public show = async (req: Request, res: Response): Promise<Response> => {
        const restaurantId = req.user.restaurantId;

        const restaurantRepository = new TypeOrmRestaurantRepository();
        const getRestaurant = new GetRestaurant(restaurantRepository);

        const restaurant = await getRestaurant.execute(restaurantId);

        return res.json(restaurant);
    }

    public update = async (req: Request, res: Response): Promise<Response> => {
        const restaurantId = req.user.restaurantId;
        const data = req.body;

        const restaurantRepository = new TypeOrmRestaurantRepository();
        const updateRestaurant = new UpdateRestaurant(restaurantRepository);

        const restaurant = await updateRestaurant.execute({
            id: restaurantId,
            ...data,
        });

        return res.json(restaurant);
    }
}

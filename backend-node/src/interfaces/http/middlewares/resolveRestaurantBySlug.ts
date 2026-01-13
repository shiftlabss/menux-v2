import { Request, Response, NextFunction } from 'express';
import { TypeOrmRestaurantRepository } from '@infrastructure/repositories/TypeOrmRestaurantRepository';

export function resolveRestaurantBySlug(restaurantRepository: TypeOrmRestaurantRepository) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            // Already authenticated requests might have restaurantId
            if ((req as any).user?.restaurantId || req.query.restaurantId || req.body.restaurantId) {
                return next();
            }

            const origin = req.headers.origin || req.headers.host;
            if (!origin) {
                return next();
            }

            // Extract subdomain/slug from origin
            // Logic: http://myslug.domain.com -> myslug
            // or myslug.localhost:3000 -> myslug

            let slug = '';

            // Removing protocol
            const cleanOrigin = origin.replace(/(^\w+:|^)\/\//, '');
            const parts = cleanOrigin.split('.');

            // If localhost, it might be slug.localhost:port
            if (cleanOrigin.includes('localhost')) {
                if (parts.length > 1 && parts[0] !== 'localhost') {
                    slug = parts[0];
                }
            } else {
                // Standard domain: slug.domain.com
                if (parts.length > 2) {
                    slug = parts[0];
                }
            }

            if (!slug || slug === 'www' || slug === 'api') {
                return next();
            }

            const restaurant = await restaurantRepository.findBySlug(slug);

            if (restaurant) {
                // Inject into query params as requested
                req.query.restaurantId = restaurant.id;
            }

            return next();
        } catch (error) {
            // Non-blocking error, just proceed without ID
            console.error('Error resolving restaurant by slug:', error);
            return next();
        }
    };
}

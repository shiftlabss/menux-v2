import { IWaiterRepository } from '@domain/repositories/IWaiterRepository';
import { Waiter } from '@domain/entities/Waiter';
import { IHashProvider } from '@domain/providers/IHashProvider';
import { AppError } from '../../../shared/errors';
import { processImageField } from '@infrastructure/storage/S3Service';

interface IRequest {
    name: string;
    nickname?: string | null;
    avatarUrl?: string | null;
    pinCode: string;
    password?: string | null;
    restaurantId: string;
}

export class CreateWaiter {
    constructor(
        private waiterRepository: IWaiterRepository,
        private hashProvider: IHashProvider
    ) { }

    async execute({ name, nickname, avatarUrl, pinCode, password, restaurantId }: IRequest): Promise<Waiter> {
        // Check if PIN code is unique within the restaurant
        const pinExists = await this.waiterRepository.findByPinCode(restaurantId, pinCode);

        if (pinExists) {
            throw new AppError('PIN code already in use for this restaurant.', 400);
        }

        // Process avatar: upload to S3 if base64
        const processedAvatarUrl = await processImageField(avatarUrl, 'waiters');

        const passwordHash = await this.hashProvider.generateHash(String(password));

        const waiter = new Waiter();
        waiter.name = name;
        waiter.nickname = nickname ?? null;
        waiter.avatarUrl = processedAvatarUrl ?? null;
        waiter.pinCode = pinCode;
        waiter.password = passwordHash ?? null;
        waiter.restaurantId = restaurantId;

        return this.waiterRepository.create(waiter);
    }
}

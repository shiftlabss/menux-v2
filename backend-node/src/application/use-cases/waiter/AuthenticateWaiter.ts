import { IWaiterRepository } from '@domain/repositories/IWaiterRepository';
import { IHashProvider } from '@domain/providers/IHashProvider';
import { ITokenProvider } from '@domain/providers/ITokenProvider';
import { AppError } from '@shared/errors';

interface IRequest {
    pinCode: string;
    password?: string;
    restaurantId: string;
}

interface IResponse {
    waiter: {
        id: string;
        name: string;
        nickname: string | null;
        restaurantId: string;
    };
    token: string;
}

export class AuthenticateWaiter {
    constructor(
        private waiterRepository: IWaiterRepository,
        private hashProvider: IHashProvider,
        private tokenProvider: ITokenProvider
    ) { }

    async execute({ pinCode, password, restaurantId }: IRequest): Promise<IResponse> {

        const waiter = await this.waiterRepository.findByPinCode(restaurantId, pinCode);


        if (!waiter) {
            throw new AppError('Código ou senha incorretos.', 401);
        }

        // Validate password if the waiter has one
        if (waiter.password) {
            if (!password) {
                throw new AppError('Senha obrigatória.', 401);
            }

            const passwordMatched = await this.hashProvider.compareHash(password, waiter.password);


            if (!passwordMatched) {
                throw new AppError('Código ou senha incorretos.', 401);
            }
        }

        const token = this.tokenProvider.generateToken({
            sub: waiter.id,
            restaurantId: waiter.restaurantId,
            role: 'waiter'
        });

        return {
            waiter: {
                id: waiter.id,
                name: waiter.name,
                nickname: waiter.nickname,
                restaurantId: waiter.restaurantId,
            },
            token,
        };
    }
}

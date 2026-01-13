import { Request, Response } from 'express';
import { AppDataSource } from '@infrastructure/database/typeorm/data-source';
import { Category } from '@domain/entities/Category';
import { MenuItem } from '@domain/entities/MenuItem';
import { TypeOrmSystemParameterRepository } from '@infrastructure/repositories/TypeOrmSystemParameterRepository';

export class WinesController {
    private categoryRepository = AppDataSource.getRepository(Category);
    private systemParameterRepository = new TypeOrmSystemParameterRepository();

    // GET /wines
    // public index = async (req: Request, res: Response) => {
    //     const systemParams = await this.systemParameterRepository.findByRestaurantId(req.user.restaurantId);
    //     const wineCategoryId = systemParams?.wineCategoryId;

    //     if (!wineCategoryId) {
    //         return res.json([]);
    //     }

    //     const wineCat = await this.categoryRepository.findOne({
    //         where: { id: wineCategoryId }
    //     });

    //     if (!wineCat) {
    //         return res.json([]);
    //     }

    //     const subCategories = await this.categoryRepository.find({
    //         where: {
    //             pai: wineCat.id
    //         }
    //     });

    //     const subCategoryIds = subCategories.map(c => c.id);

    //     const itemRepo = AppDataSource.getRepository(MenuItem);

    //     let query = itemRepo.createQueryBuilder('item')
    //         .where('item.categoryId IN (:...ids)', { ids: subCategoryIds.length > 0 ? subCategoryIds : ['00000000-0000-0000-0000-000000000000'] })
    //         .andWhere('item.isActive = :isActive', { isActive: true });

    //     const items = await query.getMany();

    //     return res.json(items);
    // }

    public index = async (req: Request, res: Response) => {

        console.log('Entrou no vinho')
        const systemParams = await this.systemParameterRepository.findByRestaurantId(req.user.restaurantId);
        const wineCategoryId = systemParams?.wineCategoryId;

        if (!wineCategoryId) {
            console.log('Não tem wineCategoryId')
            return res.json([]);
        }

        const wineCat = await this.categoryRepository.findOne({
            where: { id: wineCategoryId }
        });

        if (!wineCat) {
            console.log('Não tem wineCat')
            return res.json([]);
        }

        console.log('Tem wineCat')
        console.log(wineCat)

        const subCategories = await this.categoryRepository.find({
            where: {
                pai: wineCat.id
            }
        });

        console.log('Tem subCategories')
        console.log(subCategories)

        const subCategoryIds = subCategories.map(c => c.id);

        const itemRepo = AppDataSource.getRepository(MenuItem);


        console.log('Retornando items...')
        let query = itemRepo.createQueryBuilder('item')
            .where('item.categoryId IN (:...ids)', { ids: subCategoryIds.length > 0 ? subCategoryIds : [wineCat.id] })
            .andWhere('item.isActive = :isActive', { isActive: true });

        const items = await query.getMany();

        console.log('Tem items')
        console.log(items)

        return res.json(items);
    }

    // GET /wines/categories
    public listCategories = async (req: Request, res: Response) => {
        // const systemParams = await this.systemParameterRepository.findByRestaurantId(req.user.restaurantId);
        // const wineCategoryId = systemParams?.wineCategoryId;


        const subCategories = await this.categoryRepository.find({
            where: {
                restaurantId: req.user.restaurantId,
            }
        });

        return res.json(subCategories);


        // return res.json([]);

        // const wineCat = await this.categoryRepository.findOne({
        //     where: { id: wineCategoryId }
        // });

        // if (!wineCat) {
        //     return res.json([]);
        // }

        // const subCategories = await this.categoryRepository.find({
        //     where: {
        //         pai: wineCat.id
        //     }
        // });

        // return res.json(subCategories);
    }
}

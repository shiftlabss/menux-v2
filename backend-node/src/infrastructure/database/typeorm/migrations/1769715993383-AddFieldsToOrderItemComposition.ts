import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldsToOrderItemComposition1769715993383 implements MigrationInterface {
    name = 'AddFieldsToOrderItemComposition1769715993383'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_compositions" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "order_item_compositions" ADD "priceRule" character varying`);
        await queryRunner.query(`ALTER TABLE "order_item_compositions" ADD "extraPrice" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_compositions" DROP COLUMN "extraPrice"`);
        await queryRunner.query(`ALTER TABLE "order_item_compositions" DROP COLUMN "priceRule"`);
        await queryRunner.query(`ALTER TABLE "order_item_compositions" DROP COLUMN "name"`);
    }

}

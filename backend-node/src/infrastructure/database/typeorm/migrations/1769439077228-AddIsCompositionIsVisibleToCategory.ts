import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsCompositionIsVisibleToCategory1769439077228 implements MigrationInterface {
    name = 'AddIsCompositionIsVisibleToCategory1769439077228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_compositions" ADD "groupKey" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_compositions" DROP COLUMN "groupKey"`);
    }

}

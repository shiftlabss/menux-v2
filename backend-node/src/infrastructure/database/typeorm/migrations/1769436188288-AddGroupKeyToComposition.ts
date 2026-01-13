import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupKeyToComposition1769436188288 implements MigrationInterface {
    name = 'AddGroupKeyToComposition1769436188288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "optionsConfig" json`);
        await queryRunner.query(`ALTER TABLE "order_item_compositions" ADD "groupKey" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_compositions" DROP COLUMN "groupKey"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "optionsConfig"`);
    }

}

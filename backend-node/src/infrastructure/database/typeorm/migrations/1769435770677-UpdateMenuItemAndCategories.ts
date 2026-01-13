import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMenuItemAndCategories1769435770677 implements MigrationInterface {
    name = 'UpdateMenuItemAndCategories1769435770677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "optionsConfig" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "optionsConfig"`);
    }

}

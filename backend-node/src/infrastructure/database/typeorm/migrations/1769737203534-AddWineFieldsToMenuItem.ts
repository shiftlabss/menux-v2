import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWineFieldsToMenuItem1769737203534 implements MigrationInterface {
    name = 'AddWineFieldsToMenuItem1769737203534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "vintage" character varying`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "winery" character varying`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "grape" character varying`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "region" character varying`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "style" character varying`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "glassPrice" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "glassPrice"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "style"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "grape"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "winery"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "vintage"`);
    }

}

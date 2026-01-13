import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMenuTypeToMenuItems1769194040075 implements MigrationInterface {
    name = 'AddMenuTypeToMenuItems1769194040075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."menu_items_menutype_enum" AS ENUM('PRODUCT', 'WINE', 'PIZZA')`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "menuType" "public"."menu_items_menutype_enum" NOT NULL DEFAULT 'PRODUCT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "menuType"`);
        await queryRunner.query(`DROP TYPE "public"."menu_items_menutype_enum"`);
    }

}

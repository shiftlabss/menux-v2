import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeToMenus1769440000000 implements MigrationInterface {
    name = 'AddTypeToMenus1769440000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."menus_type_enum" AS ENUM('PRODUCT', 'PIZZA', 'WINE', 'DESSERT')`);
        await queryRunner.query(`ALTER TABLE "menus" ADD "type" "public"."menus_type_enum" NOT NULL DEFAULT 'PRODUCT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menus" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."menus_type_enum"`);
    }

}

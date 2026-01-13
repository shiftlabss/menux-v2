import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsOptionalAndPriceRuleToCategory1769709440592 implements MigrationInterface {
    name = 'AddIsOptionalAndPriceRuleToCategory1769709440592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "choice_items" DROP CONSTRAINT "FK_92deea6ce31f753baa1a90ffe69"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "isOptional" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."categories_pricerule_enum" AS ENUM('SUM', 'AVERAGE', 'HIGHEST', 'NONE')`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "priceRule" "public"."categories_pricerule_enum" NOT NULL DEFAULT 'SUM'`);
        await queryRunner.query(`ALTER TABLE "choice_items" ADD CONSTRAINT "FK_1e2d42353d223f8895818d2881e" FOREIGN KEY ("choosenMenuItemId") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "choice_items" DROP CONSTRAINT "FK_1e2d42353d223f8895818d2881e"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "priceRule"`);
        await queryRunner.query(`DROP TYPE "public"."categories_pricerule_enum"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "isOptional"`);
        await queryRunner.query(`ALTER TABLE "choice_items" ADD CONSTRAINT "FK_92deea6ce31f753baa1a90ffe69" FOREIGN KEY ("choosenMenuItemId") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class ImplementChoiceItems1769631947505 implements MigrationInterface {
    name = 'ImplementChoiceItems1769631947505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "choice_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL DEFAULT '0', "extra_price" numeric(10,2) NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "menuItemId" uuid NOT NULL, "parentMenuItemId" uuid NOT NULL, CONSTRAINT "PK_bffbbb5b6dce82a7246514834aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "choice_items" ADD CONSTRAINT "FK_92deea6ce31f753baa1a90ffe69" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "choice_items" ADD CONSTRAINT "FK_c40c78f980b9d9cabac81ad4bd8" FOREIGN KEY ("parentMenuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "choice_items" DROP CONSTRAINT "FK_c40c78f980b9d9cabac81ad4bd8"`);
        await queryRunner.query(`ALTER TABLE "choice_items" DROP CONSTRAINT "FK_92deea6ce31f753baa1a90ffe69"`);
        await queryRunner.query(`DROP TABLE "choice_items"`);
    }

}

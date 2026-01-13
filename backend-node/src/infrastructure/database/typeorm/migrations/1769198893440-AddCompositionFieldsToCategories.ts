import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompositionFieldsToCategories1769198893440 implements MigrationInterface {
    name = 'AddCompositionFieldsToCategories1769198893440'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "isComposition" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "isVisible" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "maxChoices" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "maxChoices"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "isVisible"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "isComposition"`);
    }

}

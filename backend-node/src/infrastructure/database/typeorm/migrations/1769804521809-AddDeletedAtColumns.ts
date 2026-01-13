import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAtColumns1769804521809 implements MigrationInterface {
    name = 'AddDeletedAtColumns1769804521809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "waiters" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "waiters" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "deletedAt"`);
    }

}

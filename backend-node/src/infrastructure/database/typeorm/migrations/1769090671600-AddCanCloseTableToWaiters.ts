import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCanCloseTableToWaiters1769090671600 implements MigrationInterface {
    name = 'AddCanCloseTableToWaiters1769090671600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waiters" ADD "can_close_table" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waiters" DROP COLUMN "can_close_table"`);
    }

}

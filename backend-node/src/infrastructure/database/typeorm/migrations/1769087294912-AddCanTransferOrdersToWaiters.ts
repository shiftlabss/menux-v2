import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCanTransferOrdersToWaiters1769087294912 implements MigrationInterface {
    name = 'AddCanTransferOrdersToWaiters1769087294912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waiters" ADD "canTransferOrders" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waiters" DROP COLUMN "canTransferOrders"`);
    }

}

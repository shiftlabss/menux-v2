import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameCanTransferOrdersColumn1769087473180 implements MigrationInterface {
    name = 'RenameCanTransferOrdersColumn1769087473180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waiters" RENAME COLUMN "canTransferOrders" TO "can_transfer_orders"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "waiters" RENAME COLUMN "can_transfer_orders" TO "canTransferOrders"`);
    }

}

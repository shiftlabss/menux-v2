import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTotalToTables1769112386003 implements MigrationInterface {
    name = 'AddTotalToTables1769112386003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tables" ADD "total" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tables" DROP COLUMN "total"`);
    }

}

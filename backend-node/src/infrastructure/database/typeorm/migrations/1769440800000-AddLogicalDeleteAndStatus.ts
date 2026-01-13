import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddLogicalDeleteAndStatus1769440800000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Categories
        await queryRunner.addColumn("categories", new TableColumn({
            name: "deletedAt",
            type: "timestamp",
            isNullable: true,
        }));

        // MenuItems
        await queryRunner.addColumn("menu_items", new TableColumn({
            name: "deletedAt",
            type: "timestamp",
            isNullable: true,
        }));

        // Users
        await queryRunner.addColumn("users", new TableColumn({
            name: "deletedAt",
            type: "timestamp",
            isNullable: true,
        }));
        await queryRunner.addColumn("users", new TableColumn({
            name: "isActive",
            type: "boolean",
            default: true,
        }));

        // Waiters
        await queryRunner.addColumn("waiters", new TableColumn({
            name: "deletedAt",
            type: "timestamp",
            isNullable: true,
        }));
        await queryRunner.addColumn("waiters", new TableColumn({
            name: "isActive",
            type: "boolean",
            default: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Waiters
        await queryRunner.dropColumn("waiters", "isActive");
        await queryRunner.dropColumn("waiters", "deletedAt");

        // Users
        await queryRunner.dropColumn("users", "isActive");
        await queryRunner.dropColumn("users", "deletedAt");

        // MenuItems
        await queryRunner.dropColumn("menu_items", "deletedAt");

        // Categories
        await queryRunner.dropColumn("categories", "deletedAt");
    }

}

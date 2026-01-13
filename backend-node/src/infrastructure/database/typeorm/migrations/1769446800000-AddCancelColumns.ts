import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddCancelColumns1769446800000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("waiters", new TableColumn({
            name: "can_cancel_items",
            type: "boolean",
            default: false
        }));

        await queryRunner.addColumns("order_items", [
            new TableColumn({
                name: "status",
                type: "enum",
                enum: ['WAITING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED'],
                default: "'WAITING'"
            }),
            new TableColumn({
                name: "canceled_at",
                type: "timestamp",
                isNullable: true
            }),
            new TableColumn({
                name: "canceled_by",
                type: "uuid",
                isNullable: true
            })
        ]);

        await queryRunner.createForeignKey("order_items", new TableForeignKey({
            columnNames: ["canceled_by"],
            referencedColumnNames: ["id"],
            referencedTableName: "waiters",
            onDelete: "SET NULL"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("order_items");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("canceled_by") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("order_items", foreignKey);
            }
        }

        await queryRunner.dropColumn("order_items", "canceled_by");
        await queryRunner.dropColumn("order_items", "canceled_at");
        await queryRunner.dropColumn("order_items", "status");
        await queryRunner.dropColumn("waiters", "can_cancel_items");
    }

}

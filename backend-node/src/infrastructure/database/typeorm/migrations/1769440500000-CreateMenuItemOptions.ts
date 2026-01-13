import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMenuItemOptions1769440500000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "menu_items_options",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()"
                },
                {
                    name: "menu_item_id",
                    type: "uuid",
                    isNullable: false
                },
                {
                    name: "category_group_id",
                    type: "uuid",
                    isNullable: false
                },
                {
                    name: "option_item_id",
                    type: "uuid",
                    isNullable: false
                },
                {
                    name: "price",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: true
                },
                {
                    name: "is_active",
                    type: "boolean",
                    default: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        await queryRunner.createForeignKey("menu_items_options", new TableForeignKey({
            columnNames: ["menu_item_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "menu_items",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("menu_items_options", new TableForeignKey({
            columnNames: ["category_group_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "category_groups", // Assuming table name
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("menu_items_options", new TableForeignKey({
            columnNames: ["option_item_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "menu_items",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("menu_items_options");
        if (!table) return;
        const foreignKey1 = table.foreignKeys.find(fk => fk.columnNames.indexOf("menu_item_id") !== -1);
        const foreignKey2 = table.foreignKeys.find(fk => fk.columnNames.indexOf("category_group_id") !== -1);
        const foreignKey3 = table.foreignKeys.find(fk => fk.columnNames.indexOf("option_item_id") !== -1);

        if (foreignKey1) await queryRunner.dropForeignKey("menu_items_options", foreignKey1);
        if (foreignKey2) await queryRunner.dropForeignKey("menu_items_options", foreignKey2);
        if (foreignKey3) await queryRunner.dropForeignKey("menu_items_options", foreignKey3);

        await queryRunner.dropTable("menu_items_options");
    }

}

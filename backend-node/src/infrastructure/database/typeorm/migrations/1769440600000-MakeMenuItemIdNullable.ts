import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class MakeMenuItemIdNullable1769440600000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key first depending on naming convention
        // We know the constraint name from previous error or standard naming
        const table = await queryRunner.getTable("menu_items_options");
        if (!table) {
            throw new Error("Table 'menu_items_options' not found");
        }
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("menu_item_id") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("menu_items_options", foreignKey);
        }

        // Alter column to be nullable
        await queryRunner.changeColumn("menu_items_options", "menu_item_id", new TableColumn({
            name: "menu_item_id",
            type: "uuid",
            isNullable: true
        }));

        // Re-add foreign key
        await queryRunner.createForeignKey("menu_items_options", new TableForeignKey({
            columnNames: ["menu_item_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "menu_items",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("menu_items_options");
        if (!table) {
            throw new Error("Table 'menu_items_options' not found");
        }
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("menu_item_id") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("menu_items_options", foreignKey);
        }

        await queryRunner.changeColumn("menu_items_options", "menu_item_id", new TableColumn({
            name: "menu_item_id",
            type: "uuid",
            isNullable: false
        }));

        await queryRunner.createForeignKey("menu_items_options", new TableForeignKey({
            columnNames: ["menu_item_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "menu_items",
            onDelete: "CASCADE"
        }));
    }

}

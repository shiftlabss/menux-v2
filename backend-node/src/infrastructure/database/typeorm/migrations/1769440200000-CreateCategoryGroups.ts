import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateCategoryGroups1769440200000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "category_groups",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    generationStrategy: "uuid",
                    default: "uuid_generate_v4()",
                },
                {
                    name: "categoryId",
                    type: "uuid",
                },
                {
                    name: "compositionCategoryId",
                    type: "uuid",
                },
                {
                    name: "order",
                    type: "int",
                    default: 0
                },
                {
                    name: "min",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "max",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }));

        await queryRunner.createForeignKey("category_groups", new TableForeignKey({
            columnNames: ["categoryId"],
            referencedColumnNames: ["id"],
            referencedTableName: "categories",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("category_groups", new TableForeignKey({
            columnNames: ["compositionCategoryId"],
            referencedColumnNames: ["id"],
            referencedTableName: "categories",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("category_groups");
        if (table) {
            const foreignKey1 = table.foreignKeys.find(fk => fk.columnNames.indexOf("categoryId") !== -1);
            const foreignKey2 = table.foreignKeys.find(fk => fk.columnNames.indexOf("compositionCategoryId") !== -1);

            if (foreignKey1) await queryRunner.dropForeignKey("category_groups", foreignKey1);
            if (foreignKey2) await queryRunner.dropForeignKey("category_groups", foreignKey2);

            await queryRunner.dropTable("category_groups");
        }
    }

}

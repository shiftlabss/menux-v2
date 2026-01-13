import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddMaxChoicesToMenuItems1769440300000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("menu_items", new TableColumn({
            name: "maxChoices",
            type: "int",
            isNullable: true,
            default: 1
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("menu_items", "maxChoices");
    }

}

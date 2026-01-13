import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSystemParameters1769440100000 implements MigrationInterface {
    name = 'CreateSystemParameters1769440100000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "system_parameters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "restaurantId" uuid NOT NULL, "pizzaCategoryId" uuid, "wineCategoryId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_system_parameters_id" PRIMARY KEY ("id"))`);

        // Ensure unique restaurantId if we want one per restaurant
        await queryRunner.query(`ALTER TABLE "system_parameters" ADD CONSTRAINT "UQ_system_parameters_restaurantId" UNIQUE ("restaurantId")`);

        await queryRunner.query(`ALTER TABLE "system_parameters" ADD CONSTRAINT "FK_system_parameters_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "system_parameters" ADD CONSTRAINT "FK_system_parameters_pizza_category" FOREIGN KEY ("pizzaCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "system_parameters" ADD CONSTRAINT "FK_system_parameters_wine_category" FOREIGN KEY ("wineCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "system_parameters" DROP CONSTRAINT "FK_system_parameters_wine_category"`);
        await queryRunner.query(`ALTER TABLE "system_parameters" DROP CONSTRAINT "FK_system_parameters_pizza_category"`);
        await queryRunner.query(`ALTER TABLE "system_parameters" DROP CONSTRAINT "FK_system_parameters_restaurant"`);
        await queryRunner.query(`ALTER TABLE "system_parameters" DROP CONSTRAINT "UQ_system_parameters_restaurantId"`);
        await queryRunner.query(`DROP TABLE "system_parameters"`);
    }

}

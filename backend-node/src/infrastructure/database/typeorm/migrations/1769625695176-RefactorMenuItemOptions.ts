import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorMenuItemOptions1769625695176 implements MigrationInterface {
    name = 'RefactorMenuItemOptions1769625695176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items_options" DROP CONSTRAINT "FK_a3a545197b6e78ba8e98841a06c"`);
        await queryRunner.query(`ALTER TABLE "menu_items_options" DROP CONSTRAINT "FK_d857f0175e0368d1bbbca6cda3c"`);
        await queryRunner.query(`ALTER TABLE "system_parameters" DROP CONSTRAINT "FK_system_parameters_wine_category"`);
        await queryRunner.query(`ALTER TABLE "system_parameters" DROP CONSTRAINT "FK_system_parameters_pizza_category"`);
        await queryRunner.query(`ALTER TABLE "system_parameters" DROP CONSTRAINT "FK_system_parameters_restaurant"`);
        await queryRunner.query(`CREATE TABLE "menu_item_option_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "menu_item_option_id" uuid NOT NULL, "menu_item_id" uuid NOT NULL, "price" numeric(10,2), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcf7b2fa3130a06e0609a650342" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "menu_items_options" DROP COLUMN "option_item_id"`);
        await queryRunner.query(`ALTER TABLE "menu_items_options" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "canPriceBeZero" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "menu_item_option_items" ADD CONSTRAINT "FK_9daff9a86ff1262408e253800a3" FOREIGN KEY ("menu_item_option_id") REFERENCES "menu_items_options"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_item_option_items" ADD CONSTRAINT "FK_a774d2f5a0fb08eca1f51620430" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_items_options" ADD CONSTRAINT "FK_d857f0175e0368d1bbbca6cda3c" FOREIGN KEY ("category_group_id") REFERENCES "category_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "system_parameters" ADD CONSTRAINT "FK_1fca572e8b86d2001edd4e33bd9" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "system_parameters" ADD CONSTRAINT "FK_be6efa036f53f0270bd8662e436" FOREIGN KEY ("pizzaCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "system_parameters" ADD CONSTRAINT "FK_204e4d53486f729aba064930277" FOREIGN KEY ("wineCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);

        // Data Migration Logic
        const items = await queryRunner.query(`SELECT id, "optionsConfig" FROM menu_items WHERE "optionsConfig" IS NOT NULL`);
        // Import crypto for UUID generation
        const { randomUUID } = require('crypto');

        for (const item of items) {
            let config = item.optionsConfig;

            if (typeof config === 'string') {
                try {
                    config = JSON.parse(config);
                } catch (e) {
                    console.warn(`Failed to parse optionsConfig for item ${item.id}`, e);
                    continue;
                }
            }

            if (!config || !config.option_groups || !Array.isArray(config.option_groups)) {
                continue;
            }

            // Cleanup old options if any exist (though we just altered the table, so maybe not strictly needed if we assume clean slate for this structure, but safest to avoid dupes if re-running logic manually)
            await queryRunner.query(`DELETE FROM menu_items_options WHERE menu_item_id = '${item.id}'`);

            for (const group of config.option_groups) {
                // Verify if group exists to prevent FK errors
                const groupExists = await queryRunner.query(`SELECT id FROM category_groups WHERE id = '${group.id}'`);
                if (groupExists.length === 0) {
                    console.warn(`Skipping group ${group.id}: Group not found`);
                    continue;
                }

                const menuItemOptionId = randomUUID();

                await queryRunner.query(`
                    INSERT INTO menu_items_options (id, menu_item_id, category_group_id, is_active, created_at, updated_at)
                    VALUES ($1, $2, $3, $4, NOW(), NOW())
                `, [menuItemOptionId, item.id, group.id, true]);

                if (group.options && Array.isArray(group.options)) {
                    for (const opt of group.options) {
                        const optItemExists = await queryRunner.query(`SELECT id FROM menu_items WHERE id = '${opt.id}'`);
                        if (optItemExists.length === 0) {
                            console.warn(`Skipping option item ${opt.id}: Item not found`);
                            continue;
                        }

                        await queryRunner.query(`
                            INSERT INTO menu_item_option_items (id, menu_item_option_id, menu_item_id, price, is_active, created_at, updated_at)
                            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                        `, [randomUUID(), menuItemOptionId, opt.id, opt.extra_price || 0, true]);
                    }
                }
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "system_parameters" DROP CONSTRAINT "FK_204e4d53486f729aba064930277"`);
        await queryRunner.query(`ALTER TABLE "system_parameters" DROP CONSTRAINT "FK_be6efa036f53f0270bd8662e436"`);
        await queryRunner.query(`ALTER TABLE "system_parameters" DROP CONSTRAINT "FK_1fca572e8b86d2001edd4e33bd9"`);
        await queryRunner.query(`ALTER TABLE "menu_items_options" DROP CONSTRAINT "FK_d857f0175e0368d1bbbca6cda3c"`);
        await queryRunner.query(`ALTER TABLE "menu_item_option_items" DROP CONSTRAINT "FK_a774d2f5a0fb08eca1f51620430"`);
        await queryRunner.query(`ALTER TABLE "menu_item_option_items" DROP CONSTRAINT "FK_9daff9a86ff1262408e253800a3"`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "canPriceBeZero" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "menu_items_options" ADD "price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "menu_items_options" ADD "option_item_id" uuid NOT NULL`);
        await queryRunner.query(`DROP TABLE "menu_item_option_items"`);
        await queryRunner.query(`ALTER TABLE "system_parameters" ADD CONSTRAINT "FK_system_parameters_restaurant" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "system_parameters" ADD CONSTRAINT "FK_system_parameters_pizza_category" FOREIGN KEY ("pizzaCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "system_parameters" ADD CONSTRAINT "FK_system_parameters_wine_category" FOREIGN KEY ("wineCategoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_items_options" ADD CONSTRAINT "FK_d857f0175e0368d1bbbca6cda3c" FOREIGN KEY ("category_group_id") REFERENCES "category_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_items_options" ADD CONSTRAINT "FK_a3a545197b6e78ba8e98841a06c" FOREIGN KEY ("option_item_id") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

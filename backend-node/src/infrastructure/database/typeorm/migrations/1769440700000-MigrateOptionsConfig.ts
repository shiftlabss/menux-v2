import { MigrationInterface, QueryRunner } from "typeorm";
import * as crypto from 'crypto';

export class MigrateOptionsConfig1769440700000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Fetch all items with optionsConfig
        const items = await queryRunner.query(`SELECT id, "optionsConfig" FROM menu_items WHERE "optionsConfig" IS NOT NULL`);

        for (const item of items) {
            let config = item.optionsConfig;

            // Handle potential string vs object (pg driver usually parses JSON)
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

            // Remove existing mapped options to avoid duplicates before backfilling
            await queryRunner.query(`DELETE FROM menu_items_options WHERE menu_item_id = $1`, [item.id]);

            for (const group of config.option_groups) {
                // Verify if group exists to prevent FK errors
                const groupExists = await queryRunner.query(`SELECT id FROM category_groups WHERE id = $1`, [group.id]);
                if (groupExists.length === 0) {
                    console.warn(`Skipping group ${group.id} for item ${item.id}: Group not found`);
                    continue;
                }

                if (group.options && Array.isArray(group.options)) {
                    for (const opt of group.options) {
                        // Verify opt item exists
                        const optItemExists = await queryRunner.query(`SELECT id FROM menu_items WHERE id = $1`, [opt.id]);
                        if (optItemExists.length === 0) {
                            console.warn(`Skipping option item ${opt.id} for item ${item.id}: Item not found`);
                            continue;
                        }

                        // Generate UUID
                        const uuid = crypto.randomUUID();

                        try {
                            await queryRunner.query(`
                                INSERT INTO menu_items_options (id, menu_item_id, category_group_id, option_item_id, price, is_active, created_at, updated_at)
                                VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
                            `, [
                                uuid,
                                item.id,
                                group.id,
                                opt.id,
                                opt.extra_price || 0,
                                true
                            ]);
                        } catch (err) {
                            console.error(`Error inserting option for item ${item.id}`, err);
                        }
                    }
                }
            }
        }
    }

    public async down(_queryRunner: QueryRunner): Promise<void> {
        // We do not revert data migrations usually, as it implies data loss if we continued working.
    }

}

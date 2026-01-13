import { AppDataSource } from '@infrastructure/database/typeorm/data-source';
import { MenuItem } from '@domain/entities/MenuItem';
import { ChoiceItem } from '@domain/entities/ChoiceItem';

async function migrateOptionsToChoiceItems() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected.");

        const menuRepository = AppDataSource.getRepository(MenuItem);
        const choiceRepository = AppDataSource.getRepository(ChoiceItem);

        // Fetch items with optionsConfig
        const items = await menuRepository
            .createQueryBuilder("item")
            .select(["item.id", "item.name", "item.optionsConfig"])
            .where("item.optionsConfig IS NOT NULL")
            .getMany();

        console.log(`Found ${items.length} items with optionsConfig.`);

        for (const item of items) {
            console.log(item)
            let config = item.optionsConfig;

            if (typeof config === 'string') {
                try {
                    config = JSON.parse(config);
                    console.log(config)
                } catch (e) {
                    console.error(`Failed to parse optionsConfig for item ${item.id}`, e);
                    continue;
                }
            }

            // console.log(config)

            if (!config || !config.option_groups || !Array.isArray(config.option_groups)) {
                console.log(`Item ${item.id} has invalid optionsConfig structure.`);
                continue;
            }

            console.log(`Processing item ${item.name} (${item.id})...`);

            // Optional: Clear existing choice items for this parent to avoid duplicates if re-run
            await choiceRepository.delete({ parentMenuItemId: item.id });

            let orderSequence = 1;
            console.log(config)

            for (const group of config.option_groups) {
                if (group.options && Array.isArray(group.options)) {
                    for (const opt of group.options) {
                        const choiceItem = new ChoiceItem();
                        choiceItem.parentMenuItemId = item.id;
                        choiceItem.choosenMenuItemId = opt.id; // The ID of the item being chosen
                        choiceItem.extra_price = opt.extra_price || 0;
                        choiceItem.order = orderSequence++;
                        choiceItem.isActive = true;

                        await choiceRepository.save(choiceItem);
                        console.log(`  - Created choice: ${opt.id} (Price: ${choiceItem.extra_price}, Order: ${choiceItem.order})`);
                    }
                }
            }
        }

        console.log("Migration finished successfully.");
    } catch (error) {
        console.error("Error during migration:", error);
    } finally {
        await AppDataSource.destroy();
    }
}

migrateOptionsToChoiceItems();

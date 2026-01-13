import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompositionEntities1769199162603 implements MigrationInterface {
    name = 'CreateCompositionEntities1769199162603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_item_compositions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderItemId" uuid NOT NULL, "menuItemId" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT '1', "price" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_b2aa7efb79a95547e0d56811693" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu_item_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "menuItemId" uuid NOT NULL, "optionItemId" uuid NOT NULL, CONSTRAINT "PK_5f9cc4a2480757f075354302fdb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_item_compositions" ADD CONSTRAINT "FK_e319ddfee17e026ec2a02f56289" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_compositions" ADD CONSTRAINT "FK_4be00eed19197e0d1dc047a1939" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_item_options" ADD CONSTRAINT "FK_7615f34e2b9554c8d9fe0062a79" FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_item_options" ADD CONSTRAINT "FK_dd4debe72dad6c110c4989d2ed3" FOREIGN KEY ("optionItemId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_item_options" DROP CONSTRAINT "FK_dd4debe72dad6c110c4989d2ed3"`);
        await queryRunner.query(`ALTER TABLE "menu_item_options" DROP CONSTRAINT "FK_7615f34e2b9554c8d9fe0062a79"`);
        await queryRunner.query(`ALTER TABLE "order_item_compositions" DROP CONSTRAINT "FK_4be00eed19197e0d1dc047a1939"`);
        await queryRunner.query(`ALTER TABLE "order_item_compositions" DROP CONSTRAINT "FK_e319ddfee17e026ec2a02f56289"`);
        await queryRunner.query(`DROP TABLE "menu_item_options"`);
        await queryRunner.query(`DROP TABLE "order_item_compositions"`);
    }

}

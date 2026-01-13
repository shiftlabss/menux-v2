import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { OrderItem } from './OrderItem';
import { MenuItem } from './MenuItem';

@Entity('order_item_compositions')
export class OrderItemComposition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => OrderItem, (orderItem) => orderItem.compositionItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderItemId' })
    orderItem: OrderItem;

    @Column()
    orderItemId: string;

    @ManyToOne(() => MenuItem)
    @JoinColumn({ name: 'menuItemId' })
    menuItem: MenuItem;

    @Column()
    menuItemId: string;

    @Column({ nullable: true })
    groupKey: string;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @Column({ nullable: true })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    priceRule: string | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    extraPrice: number;
}

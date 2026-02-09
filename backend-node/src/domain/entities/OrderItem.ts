import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Order } from './Order';
import { MenuItem } from './MenuItem';
import { OrderItemComposition } from './OrderItemComposition';
import { Waiter } from './Waiter';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ['WAITING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED'],
        default: 'WAITING',
    })
    status: 'WAITING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELED';

    @Column({ name: 'canceled_at', type: 'timestamp', nullable: true })
    canceledAt: Date | null;

    @ManyToOne(() => Waiter, { nullable: true })
    @JoinColumn({ name: 'canceled_by' })
    canceledBy: Waiter | null;

    @Column({ name: 'canceled_by', type: 'uuid', nullable: true })
    canceledById: string | null;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'order_id', type: 'uuid' })
    orderId: string;

    @ManyToOne(() => MenuItem)
    @JoinColumn({ name: 'menu_item_id' })
    menuItem: MenuItem;

    @Column({ name: 'menu_item_id', type: 'uuid' })
    menuItemId: string;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    observation: string;

    @Column({ name: 'decision_time', type: 'int', nullable: true })
    decisionTime: number | null;

    @Column({ name: 'is_suggestion', type: 'boolean', default: false })
    isSuggestion: boolean;

    @Column({ name: 'suggestion_type', type: 'varchar', nullable: true })
    suggestionType: string | null;

    @OneToMany(() => OrderItemComposition, (comp) => comp.orderItem, { cascade: true })
    compositionItems: OrderItemComposition[];
}

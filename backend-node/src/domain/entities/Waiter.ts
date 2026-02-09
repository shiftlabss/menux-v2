import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    AfterLoad,
} from 'typeorm';
import { Restaurant } from './Restaurant';

@Entity('waiters')
export class Waiter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'varchar', nullable: true })
    nickname: string | null;

    @Column({ type: 'varchar', nullable: true })
    avatarUrl: string | null;

    @Column({ length: 4 })
    pinCode: string;

    @Column({ type: 'varchar', nullable: true })
    password: string | null;

    @Column({ name: 'can_transfer_orders', type: 'boolean', default: false })
    canTransferOrders: boolean;

    @Column({ name: 'can_close_table', type: 'boolean', default: false })
    canCloseTable: boolean;

    @Column({ name: 'can_cancel_items', type: 'boolean', default: false })
    canCancelItems: boolean;

    @ManyToOne(() => Restaurant)
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;

    @Column({ name: 'restaurant_id' })
    restaurantId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @AfterLoad()
    transformAvatarUrl() {
        if (this.avatarUrl && !this.avatarUrl.startsWith('http')) {
            const bucketUrl = process.env.AWS_S3_BUCKET_URL || 'https://menux-bucket.s3.us-east-2.amazonaws.com/';
            this.avatarUrl = `${bucketUrl}${this.avatarUrl}`;
        }
    }
}


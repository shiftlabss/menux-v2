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

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ default: 'user' })
    role: string;

    @ManyToOne(() => Restaurant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;

    @Column({ name: 'restaurant_id', type: 'uuid', nullable: true })
    restaurantId: string;

    @Column({ nullable: true })
    jobTitle: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    avatarUrl: string;

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


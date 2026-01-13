import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Restaurant } from './Restaurant';
import { Category } from './Category';

@Entity('system_parameters')
export class SystemParameter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    restaurantId: string;

    @OneToOne(() => Restaurant, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'restaurantId' })
    restaurant: Restaurant;

    @Column({ nullable: true })
    pizzaCategoryId: string | null;

    @ManyToOne(() => Category, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'pizzaCategoryId' })
    pizzaCategory: Category | null;

    @Column({ nullable: true })
    wineCategoryId: string | null;

    @ManyToOne(() => Category, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'wineCategoryId' })
    wineCategory: Category | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

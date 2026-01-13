import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { MenuItem } from './MenuItem';
import { Exclude } from 'class-transformer';

@Entity('choice_items')
export class ChoiceItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    extra_price: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // The product being chosen (e.g. "Pepperoni")
    @Column()
    choosenMenuItemId: string;


    @ManyToOne(() => MenuItem)
    @JoinColumn({ name: 'choosenMenuItemId' })
    choosenMenuItem: MenuItem;


    // The parent product that has this choice (e.g. "Pizza Large")
    @Column()
    parentMenuItemId: string;

    @Exclude()
    @ManyToOne(() => MenuItem, (item) => item.choiceItems, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'parentMenuItemId' })
    parentMenuItem: MenuItem;
}

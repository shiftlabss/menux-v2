import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Category } from './Category';

@Entity('category_groups')
export class CategoryGroup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Category, (category) => category.groupLinks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: string;

    @ManyToOne(() => Category, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'compositionCategoryId' })
    compositionCategory: Category;

    @Column()
    compositionCategoryId: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'int', nullable: true })
    min: number;

    @Column({ type: 'int', nullable: true })
    max: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

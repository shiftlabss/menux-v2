import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Restaurant } from './Restaurant';
import { MenuItem } from './MenuItem';
import { CategoryGroup } from './CategoryGroup';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int', default: 0 })
  order: number; // For sorting

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isComposition: boolean;

  @Column({ default: true })
  isVisible: boolean; // Visualizar no cardápio

  @Column({ default: false })
  canPriceBeZero: boolean;

  @Column({ type: 'int', nullable: true })
  maxChoices: number | null;

  @Column({ nullable: true })
  pai: string | null;

  @Column({ default: false })
  isOptional: boolean;

  @Column({
    type: 'enum',
    enum: ['SUM', 'AVERAGE', 'HIGHEST', 'NONE'],
    default: 'SUM'
  })
  priceRule: 'SUM' | 'AVERAGE' | 'HIGHEST' | 'NONE';

  @ManyToOne(() => Category, (category) => category.subcategories, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'pai' })
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  subcategories: Category[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories)
  @JoinColumn({ name: 'restaurantId' })
  restaurant: Restaurant;

  @Column()
  restaurantId: string;

  @OneToMany(() => MenuItem, (item) => item.category)
  items: MenuItem[];

  @OneToMany(() => CategoryGroup, (group) => group.category)
  groupLinks: CategoryGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

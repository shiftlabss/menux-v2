import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
<<<<<<< HEAD
  OneToMany,
  AfterLoad,

=======
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)
} from 'typeorm';

import { Type } from 'class-transformer';
import { Category } from './Category';

<<<<<<< HEAD

import { Menu } from './Menu';
import { ChoiceItem } from './ChoiceItem';

interface OptionsConfig {
  sort_order: string[],
  option_groups: {
    id: string;
    name?: string;
    description?: string;
    min_selected: number;
    max_selected?: number;
    max_selected_dynamic?: string;
    options: {
      id: string;
      name?: string;
      extra_price: number;
      max_flavors?: number;
    }[];
  }[];
}
=======
import { Menu } from './Menu';
>>>>>>> 90e62cd (backend - adequação da rota e do método de sugestões)

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  ingredients: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'simple-array', nullable: true })
  allergens: string[];

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.items)
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => Menu, (menu) => menu.items, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menuId' })
  menu: Menu;

  @Column({ nullable: false })
  menuId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: ['PRODUCT', 'WINE', 'PIZZA'],
    default: 'PRODUCT'
  })
  menuType: 'PRODUCT' | 'WINE' | 'PIZZA';

  @Column({ type: 'int', default: 1, nullable: true })
  maxChoices: number;


  @Column({ type: 'json', nullable: true, select: false })
  optionsConfig: OptionsConfig;

  @Type(() => ChoiceItem)
  @OneToMany(() => ChoiceItem, (choice) => choice.parentMenuItem, { cascade: true, orphanedRowAction: 'delete' })
  choiceItems: ChoiceItem[];

  // Wine-specific fields
  @Column({ nullable: true })
  vintage: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  winery: string;

  @Column({ nullable: true })
  grape: string;

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  style: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  glassPrice: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @AfterLoad()
  transformImageUrl() {
    if (this.imageUrl && !this.imageUrl.startsWith('http')) {
      const bucketUrl = process.env.AWS_S3_BUCKET_URL || 'https://menux-bucket.s3.us-east-2.amazonaws.com/';
      this.imageUrl = `${bucketUrl}${this.imageUrl}`;
    }
  }
}


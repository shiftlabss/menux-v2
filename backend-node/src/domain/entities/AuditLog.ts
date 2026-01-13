import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    actionType: string; // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', etc.

    @Column()
    description: string;

    @Column()
    entity: string; // e.g., 'User', 'MenuItem'

    @Column({ nullable: true })
    entityId: string;

    @Column('jsonb', { nullable: true })
    metadata: {
        oldValue?: any;
        newValue?: any;
        [key: string]: any;
    };

    @Column({ nullable: true })
    ipAddress: string;

    @CreateDateColumn()
    timestamp: Date;
}

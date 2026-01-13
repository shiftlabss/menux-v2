import { Repository } from 'typeorm';
import { IAuditLogsRepository } from '@domain/repositories/IAuditLogsRepository';
import { AuditLog } from '@domain/entities/AuditLog';
import { AppDataSource } from '../database/typeorm/data-source';

export class TypeOrmAuditLogsRepository implements IAuditLogsRepository {
    private repository: Repository<AuditLog>;

    constructor() {
        this.repository = AppDataSource.getRepository(AuditLog);
    }

    async create(data: Partial<AuditLog>): Promise<AuditLog> {
        const log = this.repository.create(data);
        return this.repository.save(log);
    }

    async findByUser(userId: string, options?: { limit?: number; offset?: number; actionType?: string; startDate?: Date; endDate?: Date }): Promise<AuditLog[]> {
        const query = this.repository.createQueryBuilder('audit_log')
            .where('audit_log.userId = :userId', { userId });

        if (options?.actionType) {
            query.andWhere('audit_log.actionType = :actionType', { actionType: options.actionType });
        }

        if (options?.startDate) {
            query.andWhere('audit_log.timestamp >= :startDate', { startDate: options.startDate });
        }

        if (options?.endDate) {
            query.andWhere('audit_log.timestamp <= :endDate', { endDate: options.endDate });
        }

        query.orderBy('audit_log.timestamp', 'DESC');

        if (options?.limit) {
            query.take(options.limit);
        }

        if (options?.offset) {
            query.skip(options.offset);
        }

        return query.getMany();
    }

    async countByUser(userId: string, options?: { actionType?: string; startDate?: Date; endDate?: Date }): Promise<number> {
        const query = this.repository.createQueryBuilder('audit_log')
            .where('audit_log.userId = :userId', { userId });

        if (options?.actionType) {
            query.andWhere('audit_log.actionType = :actionType', { actionType: options.actionType });
        }

        if (options?.startDate) {
            query.andWhere('audit_log.timestamp >= :startDate', { startDate: options.startDate });
        }

        if (options?.endDate) {
            query.andWhere('audit_log.timestamp <= :endDate', { endDate: options.endDate });
        }

        return query.getCount();
    }
}

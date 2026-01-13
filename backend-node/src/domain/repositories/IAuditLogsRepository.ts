import { AuditLog } from '../entities/AuditLog';

export interface IAuditLogsRepository {
    create(data: Partial<AuditLog>): Promise<AuditLog>;
    findByUser(userId: string, options?: { limit?: number; offset?: number; actionType?: string; startDate?: Date; endDate?: Date }): Promise<AuditLog[]>;
    countByUser(userId: string, options?: { actionType?: string; startDate?: Date; endDate?: Date }): Promise<number>;
}

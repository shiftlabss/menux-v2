import { IAuditLogsRepository } from '@domain/repositories/IAuditLogsRepository';
import { AuditLog } from '@domain/entities/AuditLog';

interface IRequest {
    userId: string;
    actionType: string;
    entity: string;
    entityId?: string;
    description: string;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
}

export class CreateAuditLog {
    constructor(private auditLogsRepository: IAuditLogsRepository) { }

    async execute(data: IRequest): Promise<AuditLog> {
        return this.auditLogsRepository.create(data);
    }
}

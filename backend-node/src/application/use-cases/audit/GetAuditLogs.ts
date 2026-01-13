import { IAuditLogsRepository } from '@domain/repositories/IAuditLogsRepository';
import { AuditLog } from '@domain/entities/AuditLog';

interface IRequest {
    userId: string;
    limit?: number;
    offset?: number;
    actionType?: string;
    startDate?: Date;
    endDate?: Date;
}

interface IResponse {
    logs: AuditLog[];
    total: number;
}

export class GetAuditLogs {
    constructor(private auditLogsRepository: IAuditLogsRepository) { }

    async execute({ userId, limit, offset, actionType, startDate, endDate }: IRequest): Promise<IResponse> {
        const logs = await this.auditLogsRepository.findByUser(userId, {
            limit,
            offset,
            actionType,
            startDate,
            endDate,
        });

        const total = await this.auditLogsRepository.countByUser(userId, {
            actionType,
            startDate,
            endDate,
        });

        return { logs, total };
    }
}

import { Request, Response } from 'express';
import { TypeOrmAuditLogsRepository } from '../../../infrastructure/repositories/TypeOrmAuditLogsRepository';
import { GetAuditLogs } from '../../../application/use-cases/audit/GetAuditLogs';
import { CreateAuditLog } from '../../../application/use-cases/audit/CreateAuditLog';

export class AuditLogsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { id } = request.params; // User ID
        const { actionType, entity, entityId, description, metadata } = request.body;

        const auditLogsRepository = new TypeOrmAuditLogsRepository();
        const createAuditLog = new CreateAuditLog(auditLogsRepository);

        const log = await createAuditLog.execute({
            userId: id,
            actionType,
            entity,
            entityId,
            description,
            metadata,
            ipAddress: request.ip,
            userAgent: request.get('User-Agent'),
        });

        return response.status(201).json(log);
    }

    public async index(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { page, limit, actionType, startDate, endDate } = request.query;

        const auditLogsRepository = new TypeOrmAuditLogsRepository();
        const getAuditLogs = new GetAuditLogs(auditLogsRepository);

        const limitNum = Number(limit) || 20;
        const pageNum = Number(page) || 1;
        const offset = (pageNum - 1) * limitNum;

        const { logs, total } = await getAuditLogs.execute({
            userId: id,
            limit: limitNum,
            offset,
            actionType: actionType as string,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
        });

        return response.json({
            data: logs,
            meta: {
                page: pageNum,
                limit: limitNum,
                total,
            },
        });
    }
}

import { CreateAuditLog } from '../../application/use-cases/audit/CreateAuditLog';
import { TypeOrmAuditLogsRepository } from '../../infrastructure/repositories/TypeOrmAuditLogsRepository';
import { Request } from 'express';

export const logActivity = async (
    userId: string,
    actionType: string,
    entity: string,
    description: string,
    entityId?: string,
    metadata?: any,
    req?: Request
) => {
    try {
        if (!userId) {
            console.warn('[Audit] Skipping audit log: No userId provided');
            return;
        }

        const auditRepository = new TypeOrmAuditLogsRepository();
        const createAuditLog = new CreateAuditLog(auditRepository);

        await createAuditLog.execute({
            userId,
            actionType,
            entity,
            entityId,
            description,
            metadata,
            ipAddress: req?.ip,
            userAgent: req?.get('User-Agent'),
        });
    } catch (error) {
        // Fail silently but log to console to not block the main request
        console.error('[Audit] Failed to create audit log:', error);
    }
};

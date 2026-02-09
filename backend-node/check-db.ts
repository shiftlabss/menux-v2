
import { AppDataSource } from './src/infrastructure/database/typeorm/data-source';

async function check() {
    try {
        await AppDataSource.initialize();
        console.log('DB Connection OK');
        process.exit(0);
    } catch (e) {
        console.error('DB Connection Failed', e);
        process.exit(1);
    }
}
check();

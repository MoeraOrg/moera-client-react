import workerpool from 'workerpool';
import { WorkerUrl } from 'worker-url';

import { SafeValidateFunction, SafeValidateResult } from "safe/types";

const pool = workerpool.pool(
    new WorkerUrl(new URL('../../safe/index.ts', import.meta.url)).toString(),
    { minWorkers: 4, workerType: "web" }
);

export async function validateSchema(schemaName: string, data: any, decodeBodies: boolean): Promise<SafeValidateResult> {
    return await pool.exec<SafeValidateFunction>("safeValidate", [{schemaName, data, decodeBodies}]);
}

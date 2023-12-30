import type { DataValidationCxt, ErrorObject } from 'ajv/lib/types';

export interface BasicValidateFunction<T> {
    (this: any, data: any, dataCxt?: DataValidationCxt): data is T;
    errors?: Partial<ErrorObject>[];
}

export function isSchemaValid<T>(schema: BasicValidateFunction<T>, data: any): data is T {
    return schema(data);
}

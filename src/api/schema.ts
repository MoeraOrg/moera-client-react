import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { DataValidationCxt, ErrorObject } from 'ajv/lib/types';

const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: "array"
});
addFormats(ajv);

export interface BasicValidateFunction<T> {
    (this: any, data: any, dataCxt?: DataValidationCxt): data is T;
    errors?: Partial<ErrorObject>[];
}

export function isSchemaValid<T>(schema: BasicValidateFunction<T>, data: any): data is T {
    return schema(data);
}

export default <T>(schema: JSONSchemaType<T>) => ajv.compile(schema);

import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: "array"
});
addFormats(ajv);

export function isSchemaValid<T>(schema: ValidateFunction<T>, data: any): data is T {
    return schema(data);
}

export default <T>(schema: JSONSchemaType<T>) => ajv.compile(schema);

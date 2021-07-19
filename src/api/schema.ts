import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: "array"
});
addFormats(ajv);

export default <T>(schema: JSONSchemaType<T>) => ajv.compile(schema);

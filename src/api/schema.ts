import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: "array"
});
addFormats(ajv);

export default (schema: any) => ajv.compile(schema);

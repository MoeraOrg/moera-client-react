import Ajv from 'ajv';

const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: "array"
});

export default (schema) => ajv.compile(schema);

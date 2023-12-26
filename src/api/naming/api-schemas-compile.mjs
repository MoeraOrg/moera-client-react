import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import standaloneCode from 'ajv/dist/standalone/index.js';

import { NAMING_API_SCHEMAS } from "./api-schemas.mjs";

const namingDir = path.dirname(fileURLToPath(import.meta.url));

const ajv = new Ajv({
    schemas: [NAMING_API_SCHEMAS],
    code: {source: true, esm: true, lines: true},
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: "array"
});
const idMapping = Object.fromEntries(Object.keys(NAMING_API_SCHEMAS.definitions).map(k => [k, `#/definitions/${k}`]));
let moduleCode = `// This file is generated

`;
moduleCode += standaloneCode(ajv, idMapping);
writeFileSync(path.resolve(namingDir, "api-validators.js"), moduleCode);

let tsCode = `// This file is generated

import { BasicValidateFunction } from "api/schema";
import * as NamingApiType from "api/naming/api-types";

`
Object.keys(NAMING_API_SCHEMAS.definitions)
    .map(k => `declare const ${k}: BasicValidateFunction<NamingApiType.${k}>;\n`)
    .forEach(line => tsCode += line);
writeFileSync(path.resolve(namingDir, "api-validators.d.ts"), tsCode);

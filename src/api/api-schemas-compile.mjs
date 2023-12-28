import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import standaloneCode from 'ajv/dist/standalone/index.js';

import { NAMING_API_SCHEMAS } from "./naming/api-schemas.mjs";
import { NODE_API_SCHEMAS } from "./node/api-schemas.mjs";

const apiDir = path.dirname(fileURLToPath(import.meta.url));

function compileNamingApiSchemas() {
    const ajv = new Ajv({
        schemas: [NAMING_API_SCHEMAS],
        code: {source: true, esm: true, lines: true},
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: "array"
    });
    const idMapping = Object.fromEntries(Object.keys(NAMING_API_SCHEMAS.definitions).map(k => [k, `#/definitions/${k}`]));
    let moduleCode = '// This file is generated\n\n';
    moduleCode += standaloneCode(ajv, idMapping);
    writeFileSync(path.resolve(apiDir, "naming/api-validators.js"), moduleCode);

    let tsCode = `// This file is generated

import { BasicValidateFunction } from "api/schema";
import * as NamingApiType from "api/naming/api-types";

`
    Object.keys(NAMING_API_SCHEMAS.definitions)
        .map(k => `declare const ${k}: BasicValidateFunction<NamingApiType.${k}>;\n`)
        .forEach(line => tsCode += line);
    writeFileSync(path.resolve(apiDir, "naming/api-validators.d.ts"), tsCode);
}

function compileNodeApiSchemas() {
    const ajv = new Ajv({
        schemas: [NODE_API_SCHEMAS],
        code: {source: true, esm: true, lines: true},
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: "array"
    });
    const idMapping = Object.fromEntries(Object.keys(NODE_API_SCHEMAS.definitions).map(k => [k, `#/definitions/${k}`]));
    let moduleCode = '// This file is generated\n\n';
    moduleCode += standaloneCode(ajv, idMapping);
    moduleCode += '\nexport const NODE_API_VALIDATORS = {\n';
    Object.keys(NODE_API_SCHEMAS.definitions).forEach(k => moduleCode += `    "${k}": ${k},\n`);
    moduleCode += '};\n';
    writeFileSync(path.resolve(apiDir, "node/api-validators.js"), moduleCode);
}

compileNamingApiSchemas();
compileNodeApiSchemas();

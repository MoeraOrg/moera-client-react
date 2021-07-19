import { JSONSchemaType } from 'ajv';

import schema from "api/schema";
import * as API from "api/naming/api-types";

const ObjectResultType: JSONSchemaType<API.ObjectResult> = ({
    type: "object",
    properties: {
        "jsonrpc": {
            type: "string"
        },
        "result": {
            type: "object",
            nullable: true
        },
        "id": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["jsonrpc", "result", "id"]
});
export const ObjectResult = schema(ObjectResultType);

const BooleanResultType: JSONSchemaType<API.BooleanResult> = ({
    type: "object",
    properties: {
        "jsonrpc": {
            type: "string"
        },
        "result": {
            type: "boolean",
            nullable: true
        },
        "id": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["jsonrpc", "result", "id"]
});
export const BooleanResult = schema(BooleanResultType);

const ErrorResultType: JSONSchemaType<API.ErrorResult> = {
    type: "object",
    properties: {
        "jsonrpc": {
            type: "string"
        },
        "error": {
            type: "object",
            properties: {
                "code": {
                    type: "integer"
                },
                "message": {
                    type: "string"
                }
            },
            additionalProperties: false,
            required: ["code", "message"]
        },
        "id": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["jsonrpc", "error", "id"]
};
export const ErrorResult = schema(ErrorResultType);

const RegisteredNameInfoType: JSONSchemaType<API.RegisteredNameInfo> = {
    type: "object",
    properties: {
        "name": {
            type: "string"
        },
        "generation": {
            type: "integer",
            minimum: 0
        },
        "updatingKey": {
            type: "string"
        },
        "nodeUri": {
            type: "string",
            nullable: true
        },
        "signingKey": {
            type: "string",
            nullable: true
        },
        "validFrom": {
            type: "integer",
            nullable: true
        }
    },
    additionalProperties: false,
    required: ["name", "generation", "updatingKey"]
};
export const RegisteredNameInfo = schema(RegisteredNameInfoType);

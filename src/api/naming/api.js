import schema from "api/schema";

const Result = (type) => (schema({
    type: "object",
    properties: {
        "jsonrpc": {
            type: "string"
        },
        "result": {
            anyOf: [
                {
                    type
                },
                {
                    type: "null"
                }
            ]
        },
        "id": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["jsonrpc", "result", "id"]
}));

export const ObjectResult = Result("object");
export const BooleanResult = Result("boolean");

export const ErrorResult = schema({
    type: "object",
    properties: {
        "jsonrpc": {
            type: "string"
        },
        "error": {
            type: "object",
            "code": {
                type: "integer"
            },
            "message": {
                type: "string"
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
});

export const RegisteredNameInfo = schema({
    type: "object",
    properties: {
        "name": {
            type: "string"
        },
        "generation": {
            type: "integer",
            minimum: 0
        },
        "latest": {
            type: "boolean"
        },
        "updatingKey": {
            type: "string"
        },
        "nodeUri": {
            type: "string"
        },
        "deadline": {
            type: "integer"
        },
        "signingKey": {
            type: "string"
        },
        "validFrom": {
            type: "integer"
        }
    },
    additionalProperties: false,
    required: ["name", "generation", "latest", "updatingKey", "deadline"]
});

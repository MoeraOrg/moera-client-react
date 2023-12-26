// This file is for schema compiler only, do not use directly

export const NAMING_API_SCHEMAS = {
    definitions: {
        ObjectResult: {
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
            required: ["jsonrpc", "id"]
        },

        BooleanResult: {
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
            required: ["jsonrpc", "id"]
        },

        ErrorResult: {
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
        },

        RegisteredNameInfo: {
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
        }
    }
}

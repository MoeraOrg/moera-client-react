interface Result<T> {
    jsonrpc: string;
    result?: T | null;
    id: number;
}

export type ObjectResult = Result<object>;
export type BooleanResult = Result<boolean>;

export interface ErrorResult {
    jsonrpc: string;
    error: {
        code: number;
        message: string;
    };
    id: number;
}

export interface RegisteredNameInfo {
    name: string;
    generation: number;
    updatingKey: string;
    nodeUri?: string | null;
    signingKey?: string | null;
    validFrom?: number | null;
}

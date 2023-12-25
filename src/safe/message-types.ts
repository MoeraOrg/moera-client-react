/*
 * Requests
 */

export interface SafeValidateMessage {
    type: "VALIDATE";
    payload: {
        id: number;
        schemaName: string;
        data: any;
        decodeBodies: boolean;
    }
}

export const safeValidateMessage = (
    id: number, schemaName: string, data: any, decodeBodies: boolean
): SafeValidateMessage => ({
    type: "VALIDATE", payload: {id, schemaName, data, decodeBodies}
});

export type SafeWorkerMessage =
    SafeValidateMessage;

/*
 * Responses
 */

export type SafeValidationErrors = { message?: string }[];

export interface SafeValidateResponse {
    type: "VALIDATE";
    payload: {
        id: number;
        valid: boolean;
        errors?: SafeValidationErrors | null;
        data: any;
    }
}

export const safeValidateResponse = (
    id: number, valid: boolean, data: any, errors?: SafeValidationErrors | null
): SafeValidateResponse => ({
    type: "VALIDATE", payload: {id, valid, data, errors}
});

export type SafeWorkerResponse =
    SafeValidateResponse;

export interface SafeValidateParameters {
    schemaName: string;
    data: any;
    decodeBodies: boolean;
}

export type SafeValidationErrors = { message?: string }[];

export interface SafeValidateResult {
    valid: boolean;
    errors?: SafeValidationErrors | null;
    data: any;
}

export type SafeValidateFunction = (params: SafeValidateParameters) => SafeValidateResult;

import { safeValidateMessage, SafeValidationErrors, SafeWorkerResponse } from "safe/message-types";

const safeWorker = new Worker(new URL('../../safe/index.ts', import.meta.url));

interface ValidationResult {
    valid: boolean;
    data: any;
    errors?: SafeValidationErrors | null;
}
type PromiseResolver = (value: ValidationResult | PromiseLike<ValidationResult>) => void;
const pending = new Map<number, PromiseResolver>();

let nextId: number = 1;

export function validateSchema(schemaName: string, data: any, decodeBodies: boolean): Promise<ValidationResult> {
    const id = nextId++;
    const promise = new Promise<ValidationResult>(resolve => pending.set(id, resolve));
    safeWorker.postMessage(safeValidateMessage(id, schemaName, data, decodeBodies));
    return promise;
}

safeWorker.onmessage = (event: MessageEvent) => {
    const message = event.data as SafeWorkerResponse;
    switch (message.type) {
        case "VALIDATE": {
            const {id, valid, data, errors} = message.payload;
            const resolver = pending.get(id);
            if (resolver != null) {
                pending.delete(id);
                resolver({valid, data, errors});
            }
        }
    }
}

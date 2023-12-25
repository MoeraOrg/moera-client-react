import { safeValidateMessage, SafeValidationErrors, SafeWorkerResponse } from "safe/message-types";

const NUM_WORKERS = 1;

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
    const safeWorker = workers[id % workers.length];
    safeWorker.postMessage(safeValidateMessage(id, schemaName, data, decodeBodies));
    return promise;
}

const onMessage = (event: MessageEvent) => {
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

function createWorker(): Worker {
    const worker = new Worker(new URL('../../safe/index.ts', import.meta.url));
    worker.onmessage = onMessage;
    return worker;
}

const workers: Worker[] = Array(NUM_WORKERS).fill(0).map(createWorker);

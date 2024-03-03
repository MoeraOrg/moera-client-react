import { PromiseResolver } from "util/misc";

const asyncCalls = new Map<number, PromiseResolver<any>>();
let asyncCallId = 0;

export function asyncCall<T>(runnable: (id: number) => void): Promise<T> {
    return new Promise<T>(resolve => {
        const id = ++asyncCallId;
        asyncCalls.set(id, resolve);
        runnable(id);
    });
}

export function asyncReturn<T>(id: number, value: T): void {
    if (asyncCalls.has(id)) {
        asyncCalls.get(id)?.(value);
        asyncCalls.delete(id);
    }
}

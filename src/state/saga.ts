import { ClientAction, ClientActionType } from "state/action";
import { ActionContext, WithContext } from "state/action-types";

type PayloadExtractor<T> = (payload: T, context: ActionContext | null) => string;

type PayloadToKey = PayloadExtractor<any> | string | null;

type SagaSaga<T extends ClientAction> = (action: WithContext<T>) => Promise<void> | void;

export interface Saga {
    action: ClientActionType;
    payloadToKey: PayloadToKey;
    saga: SagaSaga<any>;
}

export interface SagaState {
    payloadToKey: PayloadToKey;
    saga: SagaSaga<any>;
    running: Set<string>;
}

export type SagaMap = Map<ClientActionType, SagaState>;

export function saga<T extends ClientAction>(action: T["type"], payloadToKey: string | null, saga: SagaSaga<T>): Saga;
export function saga<T extends ClientAction & {payload: any}>(
    action: T["type"], payloadToKey: PayloadExtractor<T["payload"]> | string | null, saga: SagaSaga<T>
): Saga;
export function saga(action: ClientActionType, payloadToKey: PayloadToKey, saga: SagaSaga<any>): Saga {
    return {action, payloadToKey, saga};
}

function addSaga(sagas: SagaMap, sagaEntry: Saga): void {
    const {action, payloadToKey, saga} = sagaEntry;

    sagas.set(action, {
        payloadToKey,
        saga,
        running: new Set()
    })
}

export function collectSagas(...lists: Saga[] | Saga[][]): SagaMap {
    const sagas: SagaMap = new Map();
    for (const list of lists) {
        if (Array.isArray(list)) {
            for (const saga of list) {
                addSaga(sagas, saga);
            }
        } else {
            addSaga(sagas, list);
        }
    }
    return sagas;
}

export async function invokeSaga(sagas: SagaMap, action: WithContext<ClientAction>): Promise<void> {
    const signal = action.type;
    const saga = sagas.get(signal);
    if (saga === undefined) {
        return;
    }

    let key = null;
    if (saga.payloadToKey != null) {
        if (typeof(saga.payloadToKey) === "function") {
            if ("payload" in action) {
                key = saga.payloadToKey(action.payload, action.context);
            } else {
                console.error("Action saga requires payload, but action does not have one", action);
            }
        } else {
            key = saga.payloadToKey;
        }
        if (key != null) {
            if (saga.running.has(key)) {
                return;
            }
            saga.running.add(key);
        }
    }

    try {
        await saga.saga(action);
    } catch (e) {
        console.error("Error running saga for action", action);
        console.error(e);
    }
    if (key != null) {
        saga.running.delete(key);
    }
}

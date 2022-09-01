import { Action } from 'redux';
import { flush, put, select, spawn, takeEvery } from 'typed-redux-saga';
import { buffers, channel, Channel } from 'redux-saga';

import getContext from "state/context";
import { ClientAction, ClientActionType } from "state/action";
import { ActionContext, WithContext } from "state/action-types";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { CARTES_SET } from "state/cartes/actions";
import { SETTINGS_CLIENT_VALUES_LOADED } from "state/settings/actions";
import { ClientState } from "state/state";
import { OWNER_SET } from "state/node/actions";

type PayloadExtractor<T> = (payload: T, context: ActionContext | null) => string;

type PayloadToKey = PayloadExtractor<any> | string | null;

type ExecutorSaga<T extends ClientAction> = (action: WithContext<T>) => any;

type ExecuteCondition = (state: ClientState) => boolean;

type ExecuteConditionPayload<T> = (state: ClientState, payload: T) => boolean;

export interface Executor {
    action: ClientActionType;
    payloadToKey: PayloadToKey;
    saga: ExecutorSaga<any>;
    condition: ExecuteConditionPayload<any> | null;
}

export interface ExecutorState {
    payloadToKey: PayloadToKey;
    saga: ExecutorSaga<any>;
    condition: ExecuteConditionPayload<any> | null;
    running: Set<string>;
}

export type ExecutorMap = Map<ClientActionType, ExecutorState>;

const postponingChannel: Channel<WithContext<Action<string>>> = channel(buffers.expanding(10));

export function executor<T extends ClientAction>(
    action: T["type"], payloadToKey: string | null, saga: ExecutorSaga<T>,
    condition?: ExecuteCondition | null): Executor;
export function executor<T extends ClientAction & {payload: any}>(
    action: T["type"], payloadToKey: PayloadExtractor<T["payload"]> | string | null, saga: ExecutorSaga<T>,
    condition?: ExecuteConditionPayload<T["payload"]> | null): Executor;
export function executor(action: ClientActionType, payloadToKey: PayloadToKey,
                         saga: ExecutorSaga<any>, condition: ExecuteConditionPayload<any> | null = null): Executor {
    return {action, payloadToKey, saga, condition};
}

function addExecutor(executors: ExecutorMap, executor: Executor): void {
    const {action, payloadToKey, saga, condition} = executor;

    executors.set(action, {
        payloadToKey,
        saga,
        condition,
        running: new Set()
    })
}

export function collectExecutors(...lists: Executor[] | Executor[][]): ExecutorMap {
    const executors: ExecutorMap = new Map();
    for (const list of lists) {
        if (Array.isArray(list)) {
            for (const executor of list) {
                addExecutor(executors, executor);
            }
        } else {
            addExecutor(executors, list);
        }
    }
    return executors;
}

function* executorsSaga(executors: ExecutorMap, action: WithContext<ClientAction>) {
    const signal = action.type;
    const executor = executors.get(signal);
    if (executor === undefined) {
        return;
    }

    action.context = yield* select(getContext);

    if (executor.condition != null) {
        const condition = executor.condition;
        let payload: any = null;
        if ("payload" in action) {
            payload = action.payload;
        }
        const ready = yield* select((state: ClientState) => condition(state, payload));
        if (!ready) {
            yield* put(postponingChannel, action);
            return;
        }
    }

    let key = null;
    if (executor.payloadToKey != null) {
        if (typeof(executor.payloadToKey) === "function") {
            if ("payload" in action) {
                key = executor.payloadToKey(action.payload, action.context);
            } else {
                console.error("Action executor requires payload, but action does not have one", action);
            }
        } else {
            key = executor.payloadToKey;
        }
        if (key != null) {
            if (executor.running.has(key)) {
                return;
            }
            executor.running.add(key);
        }
    }

    try {
        yield* spawn(executor.saga, action);
    } catch (e) {
        console.error("Error running saga for action", action);
        console.error(e);
    }
    if (key != null) {
        executor.running.delete(key);
    }
}

function* flushPostponedSaga() {
    const context = yield* select(getContext);
    const actions = yield* flush(postponingChannel);
    for (const action of actions) {
        action.context = context;
        yield* put(action);
    }
}

export function* invokeExecutors(executors: ExecutorMap) {
    yield* takeEvery([...executors.keys()], executorsSaga, executors);
    yield* takeEvery(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, CARTES_SET, SETTINGS_CLIENT_VALUES_LOADED, OWNER_SET],
        flushPostponedSaga
    );
}

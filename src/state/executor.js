import { call, select, takeEvery } from "redux-saga/effects";
import getContext from "state/context";

export function executor(action, payloadToKey, saga) {
    return {action, payloadToKey, saga};
}

function addExecutor(executors, executor) {
    const {action, payloadToKey, saga} = executor;

    executors.set(action, {
        payloadToKey,
        saga,
        running: new Set()
    })
}

export function collectExecutors(...lists) {
    const executors = new Map();
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

function* executorsSaga(executors, action) {
    const signal = action.type;
    const executor = executors.get(signal);
    if (executor === undefined) {
        return;
    }

    let key = null;
    if (executor.payloadToKey != null) {
        if (typeof(executor.payloadToKey) === "function") {
            key = executor.payloadToKey(action.payload);
        } else {
            key = executor.payloadToKey;
        }
        if (executor.running.has(key)) {
            return;
        }
        executor.running.add(key);
    }
    action.context = yield select(getContext);
    try {
        yield call(executor.saga, action);
    } catch (e) {
        console.error("Error running saga for action", action);
        console.error(e);
    }
    if (key != null) {
        executor.running.delete(key);
    }
}

export function* invokeExecutors(executors) {
    yield takeEvery([...executors.keys()], executorsSaga, executors);
}

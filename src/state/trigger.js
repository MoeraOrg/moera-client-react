import { put, select, takeEvery } from 'redux-saga/effects';

/*
 * Trigger:
 *
 * signal - action type identifier or array of action type identifiers
 * filter - boolean expression or function (state, signal_action_object) => boolean
 * action - action object or function (signal_action_object) => action
 *
 * where signal_action_object is the action object that activated the trigger
 */

export function trigger(signal, filter, action) {
    return {signal, filter, action};
}

function addTrigger(triggers, trigger) {
    const {signal, filter, action} = trigger;

    if (filter === false) {
        return;
    }
    if (Array.isArray(signal)) {
        for (const sg of signal) {
            addTrigger(triggers, {signal: sg, filter, action});
        }
        return;
    }
    let list = triggers.get(signal);
    if (list === undefined) {
        list = [];
    }
    list.push({filter, action});
    triggers.set(signal, list);
}

export function collectTriggers(...lists) {
    const triggers = new Map();
    for (const list of lists) {
        if (Array.isArray(list)) {
            for (const trigger of list) {
                addTrigger(triggers, trigger);
            }
        } else {
            addTrigger(triggers, list);
        }
    }
    return triggers;
}

function* triggersSaga(triggers, action) {
    const signal = action.type;
    const list = triggers.get(signal);
    if (list === undefined) {
        return;
    }
    for (const trigger of list) {
        let enabled;
        if (typeof(trigger.filter) === "function") {
            enabled = !!(yield select(trigger.filter, action));
        } else {
            enabled = !!trigger.filter;
        }
        if (enabled) {
            if (typeof(trigger.action) === "function") {
                yield put(trigger.action(action));
            } else {
                yield put(trigger.action);
            }
        }
    }
}

export function* invokeTriggers(triggers) {
    yield takeEvery([...triggers.keys()], triggersSaga, triggers);
}

export function inv(func) {
    return function (...params) {
        return !func(...params);
    }
}

export function conj(...funcs) {
    if (!Array.isArray(funcs)) {
        return funcs;
    }
    return function (...params) {
        for (const func of funcs) {
            if (!func(...params)) {
                return false;
            }
        }
        return true;
    }
}

export function disj(...funcs) {
    if (!Array.isArray(funcs)) {
        return funcs;
    }
    return function (...params) {
        for (const func of funcs) {
            if (func(...params)) {
                return true;
            }
        }
        return false;
    }
}

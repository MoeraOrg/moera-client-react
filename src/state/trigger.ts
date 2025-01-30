import getContext from "state/context";
import { ClientAction, ClientActionType } from "state/action";
import { ClientState } from "state/state";
import { WithContext } from "state/action-types";
import { StoreMiddlewareApi } from "state/store-middleware";

/*
 * Trigger:
 *
 * signal - action type identifier or array of action type identifiers
 * filter - boolean expression or function (state, signal_action_object) => boolean
 * action - action object or function (signal_action_object) => action
 *
 * where signal_action_object is the action object that activated the trigger
 */

type TriggerFilter<T extends ClientAction> = (state: ClientState, signal: WithContext<T>) => boolean;

type TriggerAction<T extends ClientAction> = (signal: WithContext<T>) => ClientAction;

type TriggerAnyFilter = TriggerFilter<ClientAction>;

type TriggerAnyAction = TriggerAction<ClientAction>;

interface TriggerFilteredAction {
    filter: boolean | TriggerAnyFilter;
    action: ClientAction | TriggerAnyAction;
}

export type Trigger = {
    signal: ClientActionType | ClientActionType[];
} & TriggerFilteredAction;

export type TriggerMap = Map<ClientActionType, TriggerFilteredAction[]>;

export function trigger<T extends ClientAction>(
    signal: T["type"], filter: boolean | TriggerFilter<T>, action: ClientAction | TriggerAction<T>
): Trigger;
export function trigger<T extends ClientAction>(
    signal: ClientActionType[], filter: boolean | TriggerFilter<T>, action: ClientAction | TriggerAction<T>
): Trigger;
export function trigger(
    signal: ClientActionType | ClientActionType[], filter: boolean | TriggerAnyFilter,
    action: ClientAction | TriggerAnyAction
): Trigger {
    return {signal, filter, action};
}

function addTrigger(triggers: TriggerMap, trigger: Trigger): void {
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

export function collectTriggers(...lists: (Trigger | Trigger[])[]): TriggerMap {
    const triggers = new Map() as TriggerMap;
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

export function invokeTriggers(
    triggers: TriggerMap, action: WithContext<ClientAction>, storeApi: StoreMiddlewareApi
): void {
    const signal = action.type;
    const list = triggers.get(signal);
    if (list === undefined) {
        return;
    }
    action.context = getContext(storeApi.getState());
    for (const trigger of list) {
        let enabled;
        if (typeof(trigger.filter) === "function") {
            enabled = trigger.filter(storeApi.getState(), action);
        } else {
            enabled = trigger.filter;
        }
        if (enabled) {
            if (typeof(trigger.action) === "function") {
                storeApi.dispatch(trigger.action(action).causedBy(action));
            } else {
                storeApi.dispatch(trigger.action.causedBy(action));
            }
        }
    }
}

export function inv<T extends ClientAction>(func: TriggerFilter<T>): TriggerFilter<T> {
    return function (...params) {
        return !func(...params);
    }
}

export function conj<T extends ClientAction>(...funcs: TriggerFilter<T>[]): TriggerFilter<T> {
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

export function disj<T extends ClientAction>(...funcs: TriggerFilter<T>[]): TriggerFilter<T> {
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

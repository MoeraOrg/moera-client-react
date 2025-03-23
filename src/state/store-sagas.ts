import { ClientState } from "state/state";
import { ClientAction, ClientActionType } from "state/action";
import { WithContext } from "state/action-types";

export function select<T>(selector: (state: ClientState) => T): T;
export function select(): ClientState;
export function select<T>(selector?: (state: ClientState) => T): T | ClientState {
    return selector ? selector(window.store.getState()) : window.store.getState();
}

export const dispatch = (action: ClientAction): void =>
    window.store.dispatch(action);

export type BarrierActionType = ClientActionType | "*";

export type BarrierCondition = true | ((state: ClientState, signal: WithContext<ClientAction>) => boolean);

export function barrier<T extends ClientAction>(actions: T["type"]): Promise<WithContext<T> | null>;
export function barrier<T extends ClientAction>(
    actions: T["type"], condition: BarrierCondition, timeoutMs?: number
): Promise<WithContext<T> | null>;
export function barrier(actions: "*" | BarrierActionType[]): Promise<WithContext<ClientAction> | null>;
export function barrier(
    actions: "*" | BarrierActionType[], condition: BarrierCondition, timeoutMs?: number
): Promise<WithContext<ClientAction> | null>;
export function barrier(
    actions: BarrierActionType | BarrierActionType[], condition: BarrierCondition = true, timeoutMs?: number
): Promise<WithContext<ClientAction> | null> {
    actions = Array.isArray(actions) ? actions : [actions];
    return window.middleware.barrier(actions, condition, timeoutMs);
}

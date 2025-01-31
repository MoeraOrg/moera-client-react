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

export function barrier(
    actions: BarrierActionType | BarrierActionType[], condition: BarrierCondition = true, timeoutMs?: number
): Promise<boolean> {
    actions = Array.isArray(actions) ? actions : [actions];
    return window.middleware.barrier(actions, condition, timeoutMs);
}

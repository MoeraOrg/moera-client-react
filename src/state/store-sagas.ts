import { ClientState } from "state/state";
import { ClientAction } from "state/action";

export function select<T>(selector: (state: ClientState) => T): T;
export function select(): ClientState;
export function select<T>(selector?: (state: ClientState) => T): T | ClientState {
    return selector ? selector(window.store.getState()) : window.store.getState();
}

export const dispatch = (action: ClientAction): void =>
    window.store.dispatch(action);

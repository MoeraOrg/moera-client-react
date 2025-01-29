import { ClientState } from "state/state";
import store from "state/store";

export function select<T>(selector: (state: ClientState) => T): T;
export function select(): ClientState;
export function select<T>(selector?: (state: ClientState) => T): T | ClientState {
    return selector ? selector(store.getState()) : store.getState();
}

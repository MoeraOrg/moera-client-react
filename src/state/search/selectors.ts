import { ClientState } from "state/state";

export function getSearchQuery(state: ClientState): string {
    return state.search.query;
}

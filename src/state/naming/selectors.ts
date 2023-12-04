import { now } from "util/misc";
import { ClientState } from "state/state";
import { NameState } from "state/naming/state";

const USED_NAME_RELOAD_PERIOD = 6 * 60 * 60;

function isNamingNameToBeLoaded(state: ClientState, name: string | null): boolean {
    if (!name) {
        return false;
    }
    const details = state.naming.names[name];
    return details != null
        && (!details.loaded || now() - details.updated >= USED_NAME_RELOAD_PERIOD)
        && !details.loading;
}

export function getNamingNamesToBeLoaded(state: ClientState, names: (string | null)[]): string[] {
    return names.filter((name): name is string => isNamingNameToBeLoaded(state, name));
}

const EMPTY_DETAILS: NameState = {
    loading: false,
    loaded: false,
    nodeUri: null,
    accessed: 0,
    updated: 0
}

export function getNamingNameDetails(state: ClientState, name?: string | null): NameState {
    const details = name != null ? state.naming.names[name] : null;
    return details ? details : EMPTY_DETAILS;
}

export function getNamingNameNodeUri(state: ClientState, name?: string | null): string | null {
    const details = getNamingNameDetails(state, name);
    return details.loaded && details.nodeUri != null ? details.nodeUri : null;
}

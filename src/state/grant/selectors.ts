import { ClientState } from "state/state";

export function isGrantToBeValidated(state: ClientState): boolean {
    return !state.grant.validated
}

import { ClientState } from "state/state";
import { isPostingCached } from "state/postings/selectors";

export function isLightBoxToBeLoaded(state: ClientState) {
    return state.lightBox.postingId != null && !isPostingCached(state, state.lightBox.postingId);
}

export function isLightBoxShown(state: ClientState) {
    return state.lightBox.show;
}

export function getLightBoxPostingId(state: ClientState) {
    return state.lightBox.postingId;
}

export function getLightBoxMediaId(state: ClientState) {
    return state.lightBox.mediaId;
}

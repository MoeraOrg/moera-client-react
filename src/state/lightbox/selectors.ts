import { ClientState } from "state/state";
import { isPostingCached } from "state/postings/selectors";

export function isLightBoxToBeLoaded(state: ClientState) {
    return state.lightBox.postingId != null && !isPostingCached(state, state.lightBox.postingId)
        && !state.lightBox.loading;
}

import { ClientState } from "state/state";
import { getPosting, isPostingCached } from "state/postings/selectors";
import { getComment } from "state/detailedposting/selectors";
import { REL_CURRENT } from "util/rel-node-name";

export function isLightBoxToBeLoaded(state: ClientState) {
    return state.lightBox.postingId != null && !isPostingCached(state, state.lightBox.postingId, REL_CURRENT);
}

export function isLightBoxShown(state: ClientState) {
    return state.lightBox.show;
}

export function getLightBoxNodeName(state: ClientState) {
    return state.lightBox.nodeName;
}

export function getLightBoxPostingId(state: ClientState) {
    return state.lightBox.postingId;
}

export function getLightBoxCommentId(state: ClientState) {
    return state.lightBox.commentId;
}

export function getLightBoxMediaId(state: ClientState) {
    return state.lightBox.mediaId;
}

export function getLightBoxMediaPostingId(state: ClientState) {
    const comment = state.lightBox.commentId != null ? getComment(state, state.lightBox.commentId) : null;
    const posting = state.lightBox.postingId != null ? getPosting(state, state.lightBox.postingId, REL_CURRENT) : null;
    const media = comment != null ? comment?.media : posting?.media;
    const mediaId = getLightBoxMediaId(state);
    if (media == null || media.length === 0 || mediaId == null) {
        return null;
    }
    return media.find(attachment => attachment.media?.id === mediaId)?.media?.postingId ?? null;
}

export function isLightBoxMediaPostingToBeLoaded(state: ClientState) {
    const nodeName = getLightBoxNodeName(state);
    const postingId = getLightBoxMediaPostingId(state);
    return postingId != null && !isPostingCached(state, postingId, nodeName);
}

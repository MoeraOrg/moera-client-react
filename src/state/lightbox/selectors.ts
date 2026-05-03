import { ClientState } from "state/state";
import { getPosting, isPostingCached } from "state/postings/selectors";
import { getComment } from "state/detailedposting/selectors";
import { REL_CURRENT } from "util/rel-node-name";

export function isLightboxToBeLoaded(state: ClientState) {
    return state.lightbox.postingId != null && !isPostingCached(state, state.lightbox.postingId, REL_CURRENT);
}

export function isLightboxShown(state: ClientState) {
    return state.lightbox.show;
}

export function getLightboxNodeName(state: ClientState) {
    return state.lightbox.nodeName;
}

export function getLightboxPostingId(state: ClientState) {
    return state.lightbox.postingId;
}

export function getLightboxCommentId(state: ClientState) {
    return state.lightbox.commentId;
}

export function getLightboxMediaId(state: ClientState) {
    return state.lightbox.mediaId;
}

export function getLightboxMediaPostingId(state: ClientState) {
    const comment = state.lightbox.commentId != null ? getComment(state, state.lightbox.commentId) : null;
    const posting = state.lightbox.postingId != null ? getPosting(state, state.lightbox.postingId, REL_CURRENT) : null;
    const media = comment != null ? comment?.media : posting?.media;
    const mediaId = getLightboxMediaId(state);
    if (media == null || media.length === 0 || mediaId == null) {
        return null;
    }
    return media.find(attachment => attachment.media?.id === mediaId)?.postingId ?? null;
}

export function isLightboxMediaPostingToBeLoaded(state: ClientState) {
    const nodeName = getLightboxNodeName(state);
    const postingId = getLightboxMediaPostingId(state);
    return postingId != null && !isPostingCached(state, postingId, nodeName);
}

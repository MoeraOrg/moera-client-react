import { MediaAttachment } from "api";
import { ClientState } from "state/state";
import { getPosting, isPostingCached } from "state/postings/selectors";
import { getComment } from "state/detailedposting/selectors";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";

export function isLightboxToBeLoaded(state: ClientState): boolean {
    return state.lightbox.postingId != null && !isPostingCached(state, state.lightbox.postingId, REL_CURRENT);
}

export function isLightboxShown(state: ClientState): boolean {
    return state.lightbox.show;
}

export function getLightboxNodeName(state: ClientState): string | RelNodeName {
    return state.lightbox.nodeName;
}

export function getLightboxPostingId(state: ClientState): string | null {
    return state.lightbox.postingId;
}

export function getLightboxCommentId(state: ClientState): string | null {
    return state.lightbox.commentId;
}

export function getLightboxMediaId(state: ClientState): string | null {
    return state.lightbox.mediaId;
}

function getLightboxAttachment(state: ClientState): MediaAttachment | undefined {
    const comment = state.lightbox.commentId != null ? getComment(state, state.lightbox.commentId) : null;
    const posting = state.lightbox.postingId != null ? getPosting(state, state.lightbox.postingId, REL_CURRENT) : null;
    const media = comment != null ? comment?.media : posting?.media;
    const mediaId = getLightboxMediaId(state);
    if (media == null || media.length === 0 || mediaId == null) {
        return undefined;
    }
    return media.find(attachment =>
        attachment.media?.id === mediaId || attachment.remoteMedia?.mediaId === mediaId
    );
}

export function getLightboxMediaPostingId(state: ClientState): string | null {
    return getLightboxAttachment(state)?.postingId ?? null;
}

export function isLightboxMediaPostingToBeLoaded(state: ClientState): boolean {
    const nodeName = getLightboxNodeName(state);
    const postingId = getLightboxMediaPostingId(state);
    return postingId != null && !isPostingCached(state, postingId, nodeName);
}

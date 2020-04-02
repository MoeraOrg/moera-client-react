import { trigger } from "state/trigger";
import { EVENT_NODE_POSTING_REACTIONS_CHANGED, EVENT_NODE_POSTING_UPDATED } from "api/events/actions";
import { postingLoad, postingReactionLoad } from "state/postings/actions";
import { isPostingCached } from "state/postings/selectors";
import { TIMELINE_STORY_ADDED } from "state/timeline/actions";

export default [
    trigger(
        TIMELINE_STORY_ADDED,
        (state, signal) => !isPostingCached(state, signal.payload.postingId),
        signal => postingLoad(signal.payload.postingId)
    ),
    trigger(
        EVENT_NODE_POSTING_UPDATED,
        (state, signal) => isPostingCached(state, signal.payload.id),
        signal => postingLoad(signal.payload.id)
    ),
    trigger(
        EVENT_NODE_POSTING_REACTIONS_CHANGED,
        (state, signal) => isPostingCached(state, signal.payload.id),
        signal => postingReactionLoad(signal.payload.id)
    )
];

import { trigger } from "state/trigger";
import {
    EVENT_NODE_POSTING_DELETED,
    EVENT_NODE_POSTING_REACTIONS_CHANGED,
    EVENT_NODE_POSTING_UPDATED
} from "api/events/actions";
import { postingDeleted, postingLoad, postingReactionLoad } from "state/postings/actions";
import { isPostingCached } from "state/postings/selectors";

export default [
    trigger(
        EVENT_NODE_POSTING_UPDATED,
        (state, signal) => isPostingCached(state, signal.payload.id),
        signal => postingLoad(signal.payload.id)
    ),
    trigger(
        EVENT_NODE_POSTING_DELETED,
        true,
        signal => postingDeleted(signal.payload.id, signal.payload.moment) // FIXME
    ),
    trigger(
        EVENT_NODE_POSTING_REACTIONS_CHANGED,
        (state, signal) => isPostingCached(state, signal.payload.id),
        signal => postingReactionLoad(signal.payload.id)
    )
];

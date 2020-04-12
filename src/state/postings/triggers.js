import { trigger } from "state/trigger";
import { EVENT_NODE_POSTING_REACTIONS_CHANGED, EVENT_NODE_POSTING_UPDATED } from "api/events/actions";
import { postingLoad, postingReactionLoad } from "state/postings/actions";
import { isPostingCached } from "state/postings/selectors";
import { STORY_ADDED, STORY_UPDATED } from "state/stories/actions";

export default [
    trigger(
        [STORY_ADDED, STORY_UPDATED],
        (state, signal) => !isPostingCached(state, signal.payload.story.posting.id),
        signal => postingLoad(signal.payload.story.posting.id)
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

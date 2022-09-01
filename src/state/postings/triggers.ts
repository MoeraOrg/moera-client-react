import { trigger } from "state/trigger";
import { PostingCommentsChangedEvent, PostingReactionsChangedEvent, PostingUpdatedEvent } from "api/events/api-types";
import {
    EVENT_NODE_POSTING_COMMENTS_CHANGED,
    EVENT_NODE_POSTING_REACTIONS_CHANGED,
    EVENT_NODE_POSTING_RESTORED,
    EVENT_NODE_POSTING_UPDATED,
    EventAction
} from "api/events/actions";
import {
    POSTING_COMMENTS_SUBSCRIBED,
    POSTING_COMMENTS_UNSUBSCRIBED,
    POSTING_OPERATIONS_UPDATED,
    postingCommentsSet,
    postingLoad,
    PostingOperationsUpdatedAction,
    postingReactionLoad,
    postingReactionsReload
} from "state/postings/actions";
import { isPostingCached } from "state/postings/selectors";
import { STORY_ADDED, STORY_UPDATED, StoryAddedAction, StoryUpdatedAction } from "state/stories/actions";
import { DISCONNECTED_FROM_HOME, HOME_OWNER_SET } from "state/home/actions";
import { isConnectedToHome } from "state/home/selectors";
import { isCurrentNodeStory } from "state/stories/selectors";
import { flashBox } from "state/flashbox/actions";

export default [
    trigger(
        [STORY_ADDED, STORY_UPDATED],
        (state, signal: (StoryAddedAction | StoryUpdatedAction)) =>
            signal.payload.story.posting != null
            && isCurrentNodeStory(state, signal.payload.story)
            && !isPostingCached(state, signal.payload.story.posting.id),
        signal => postingLoad(signal.payload.story.posting!.id)
    ),
    trigger(POSTING_COMMENTS_SUBSCRIBED, true, flashBox("Following comments")),
    trigger(POSTING_COMMENTS_UNSUBSCRIBED, true, flashBox("Not following comments")),
    trigger([HOME_OWNER_SET, DISCONNECTED_FROM_HOME], true, postingReactionsReload),
    trigger(
        POSTING_OPERATIONS_UPDATED,
        (state, signal: PostingOperationsUpdatedAction) =>
            isPostingCached(state, signal.payload.id, signal.payload.nodeName),
        signal => postingLoad(signal.payload.id, signal.payload.nodeName)
    ),
    trigger(
        [EVENT_NODE_POSTING_UPDATED, EVENT_NODE_POSTING_RESTORED],
        (state, signal: EventAction<PostingUpdatedEvent>) =>
            isPostingCached(state, signal.payload.id),
        signal => postingLoad(signal.payload.id)
    ),
    trigger(
        EVENT_NODE_POSTING_REACTIONS_CHANGED,
        (state, signal: EventAction<PostingReactionsChangedEvent>) =>
            isPostingCached(state, signal.payload.id) && isConnectedToHome(state),
        signal => postingReactionLoad(signal.payload.id)
    ),
    trigger(
        EVENT_NODE_POSTING_COMMENTS_CHANGED,
        (state, signal: EventAction<PostingCommentsChangedEvent>) =>
            isPostingCached(state, signal.payload.id),
        signal => postingCommentsSet(signal.payload.id, signal.payload.total)
    )
];

import i18n from 'i18next';

import { trigger } from "state/trigger";
import {
    EVENT_NODE_POSTING_COMMENTS_CHANGED,
    EVENT_NODE_POSTING_REACTIONS_CHANGED,
    EVENT_NODE_POSTING_RESTORED,
    EVENT_NODE_POSTING_UPDATED,
    EventAction,
    PostingCommentsChangedEvent,
    PostingReactionsChangedEvent,
    PostingUpdatedEvent
} from "api/events";
import {
    postingCommentsSet,
    postingLoad,
    PostingOperationsUpdatedAction,
    postingReactionLoad,
    postingReactionsReload
} from "state/postings/actions";
import { isPostingCached } from "state/postings/selectors";
import { STORY_ADDED, STORY_UPDATED, StoryAddedAction, StoryUpdatedAction } from "state/stories/actions";
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
        signal => postingLoad(signal.payload.story.posting!.id, "")
    ),
    trigger("POSTING_COMMENTS_SUBSCRIBED", true, () => flashBox(i18n.t("following-comments"))),
    trigger("POSTING_COMMENTS_UNSUBSCRIBED", true, () => flashBox(i18n.t("not-following-comments"))),
    trigger("HOME_INTRODUCED", true, postingReactionsReload),
    trigger(
        "POSTING_OPERATIONS_UPDATED",
        (state, signal: PostingOperationsUpdatedAction) =>
            isPostingCached(state, signal.payload.id, signal.payload.nodeName),
        signal => postingLoad(signal.payload.id, signal.payload.nodeName)
    ),
    trigger(
        [EVENT_NODE_POSTING_UPDATED, EVENT_NODE_POSTING_RESTORED],
        (state, signal: EventAction<PostingUpdatedEvent>) =>
            isPostingCached(state, signal.payload.id),
        signal => postingLoad(signal.payload.id, "")
    ),
    trigger(
        EVENT_NODE_POSTING_REACTIONS_CHANGED,
        (state, signal: EventAction<PostingReactionsChangedEvent>) =>
            isPostingCached(state, signal.payload.id) && isConnectedToHome(state),
        signal => postingReactionLoad(signal.payload.id, "")
    ),
    trigger(
        EVENT_NODE_POSTING_COMMENTS_CHANGED,
        (state, signal: EventAction<PostingCommentsChangedEvent>) =>
            isPostingCached(state, signal.payload.id),
        signal => postingCommentsSet(signal.payload.id, signal.payload.total, "")
    )
];

import i18n from 'i18next';

import { trigger } from "state/trigger";
import {
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
import { WithContext } from "state/action-types";
import { isPostingCached } from "state/postings/selectors";
import { StoryAddedAction, StoryUpdatedAction } from "state/stories/actions";
import { isFeedMomentLoaded } from "state/feeds/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { flashBox } from "state/flashbox/actions";
import { REL_CURRENT } from "util/rel-node-name";

export default [
    trigger(
        ["STORY_ADDED", "STORY_UPDATED"],
        (state, signal: (WithContext<StoryAddedAction> | WithContext<StoryUpdatedAction>)) =>
            signal.payload.story.postingId != null
            && isFeedMomentLoaded(
                state, signal.payload.nodeName, signal.payload.story.feedName, signal.payload.story.moment
            )
            && !isPostingCached(state, signal.payload.story.postingId, signal.payload.nodeName),
        signal => postingLoad(signal.payload.story.postingId!, signal.payload.nodeName)
    ),
    trigger("POSTING_COMMENTS_SUBSCRIBED", true, () => flashBox(i18n.t("following-comments"))),
    trigger("POSTING_COMMENTS_UNSUBSCRIBED", true, () => flashBox(i18n.t("not-following-comments"))),
    trigger("HOME_READY", true, postingReactionsReload),
    trigger(
        "POSTING_OPERATIONS_UPDATED",
        (state, signal: PostingOperationsUpdatedAction) =>
            isPostingCached(state, signal.payload.id, signal.payload.nodeName),
        signal => postingLoad(signal.payload.id, signal.payload.nodeName)
    ),
    trigger(
        ["EVENT_NODE_POSTING_UPDATED", "EVENT_NODE_POSTING_RESTORED"],
        (state, signal: EventAction<PostingUpdatedEvent>) =>
            isPostingCached(state, signal.payload.id, REL_CURRENT),
        signal => postingLoad(signal.payload.id, REL_CURRENT)
    ),
    trigger(
        "EVENT_NODE_POSTING_REACTIONS_CHANGED",
        (state, signal: EventAction<PostingReactionsChangedEvent>) =>
            isPostingCached(state, signal.payload.id, REL_CURRENT) && isConnectedToHome(state),
        signal => postingReactionLoad(signal.payload.id, REL_CURRENT)
    ),
    trigger(
        "EVENT_NODE_POSTING_COMMENTS_CHANGED",
        (state, signal: EventAction<PostingCommentsChangedEvent>) =>
            isPostingCached(state, signal.payload.id, REL_CURRENT),
        signal => postingCommentsSet(signal.payload.id, signal.payload.total, REL_CURRENT)
    )
];

import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import i18n, { TFunction } from 'i18next';

import { StoryInfo, StorySummaryData, StoryType } from "api/node/api-types";
import { ActionContext } from "state/action-types";
import { ClientAction } from "state/action";
import { ExtStoryInfo } from "state/feeds/state";
import {
    buildAskedToFriendSummary,
    buildAskedToSubscribeSummary,
    buildBlockedUserInPostingSummary,
    buildBlockedUserSummary,
    buildCommentAddedSummary,
    buildCommentMediaReactionAddedSummary,
    buildCommentMediaReactionFailedSummary,
    buildCommentPostTaskFailedSummary,
    buildCommentReactionAddedSummary,
    buildCommentReactionTaskFailedSummary,
    buildCommentUpdateTaskFailedSummary,
    buildFriendAddedSummary,
    buildFriendDeletedSummary,
    buildFriendGroupDeletedSummary,
    buildMentionCommentSummary,
    buildMentionPostingSummary,
    buildPostingMediaReactionAddedSummary,
    buildPostingMediaReactionFailedSummary,
    buildPostingPostTaskFailedSummary,
    buildPostingReactionTaskFailedSummary,
    buildPostingSubscribeTaskFailedSummary,
    buildPostingUpdatedSummary,
    buildPostingUpdateTaskFailedSummary,
    buildReactionAddedSummary,
    buildRemoteCommentAddedSummary,
    buildReplyCommentSummary,
    buildSheriffComplainAddedSummary,
    buildSheriffComplainDecidedSummary,
    buildSheriffMarkedSummary,
    buildSheriffUnmarkedSummary,
    buildSubscriberAddedSummary,
    buildSubscriberDeletedSummary,
    buildUnblockedUserInPostingSummary,
    buildUnblockedUserSummary
} from "ui/instant/instant-summaries";
import { InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";
import InstantStorySubscribeButtons, {
    instantStorySubscribeAction
} from "ui/instant/buttons/InstantStorySubscribeButtons";
import InstantStoryFriendButtons, { instantStoryFriendAction } from "ui/instant/buttons/InstantStoryFriendButtons";
import InstantStoryFriendGroupButtons, {
    instantStoryFriendGroupAction
} from "ui/instant/buttons/InstantStoryFriendGroupButtons";
import InstantStoryBlockedButtons from "ui/instant/buttons/InstantStoryBlockedButtons";
import InstantStorySheriffOrderButtons from "ui/instant/buttons/InstantStorySheriffOrderButtons";

type InstantSummarySupplier = (data: StorySummaryData, homeOwnerName: string | null, t: TFunction) => string;

interface InstantTarget {
    nodeName: string | null | undefined;
    href: string;
}

type InstantTargetSupplier = (story: StoryInfo | ExtStoryInfo) => InstantTarget;

export type InstantStoryButtonsActionSupplier = (story: StoryInfo,
                                                 context: ActionContext) => ClientAction | null | undefined;

type SheriffField = "posting" | "comment" | "comments";

interface InstantTypeDetails {
    color?: string;
    icon?: IconProp;
    summary: InstantSummarySupplier;
    target: InstantTargetSupplier;
    buttons?: React.ComponentType<InstantStoryButtonsProps>;
    buttonsAction?: InstantStoryButtonsActionSupplier;
    sheriffFields?: SheriffField[];
}

const INSTANT_TYPES: Record<StoryType, InstantTypeDetails> = {
    "posting-added": {
        color: "var(--bs-green)",
        icon: "pen-alt",
        summary: () => "",
        target: story => ({nodeName: ":", href: `/post/${getStoryPostingId(story)}`})
    },
    "reaction-added-positive": {
        summary: (data, homeOwnerName, t) => buildReactionAddedSummary(data, false, t),
        target: story => ({nodeName: ":", href: `/post/${getStoryPostingId(story)}`})
    },
    "reaction-added-negative": {
        summary: (data, homeOwnerName, t) => buildReactionAddedSummary(data, true, t),
        target: story => ({nodeName: ":", href: `/post/${getStoryPostingId(story)}`})
    },
    "comment-reaction-added-positive": {
        summary: (data, homeOwnerName, t) => buildCommentReactionAddedSummary(data, false, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "comment-reaction-added-negative": {
        summary: (data, homeOwnerName, t) => buildCommentReactionAddedSummary(data, true, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "mention-posting": {
        color: "var(--bs-blue)",
        icon: "at",
        summary: (data, homeOwnerName, t) => buildMentionPostingSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`}),
        sheriffFields: ["posting"]
    },
    "mention-comment": {
        color: "var(--bs-blue)",
        icon: "at",
        summary: (data, homeOwnerName, t) => buildMentionCommentSummary(data, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        }),
        sheriffFields: ["posting", "comment"]
    },
    "subscriber-added": {
        color: "var(--bs-indigo)",
        icon: "eye",
        summary: (data, homeOwnerName, t) => buildSubscriberAddedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: "/"}),
        buttons: InstantStorySubscribeButtons,
        buttonsAction: instantStorySubscribeAction
    },
    "subscriber-deleted": {
        color: "var(--bs-indigo)",
        icon: "eye-slash",
        summary: (data, homeOwnerName, t) => buildSubscriberDeletedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: "/"})
    },
    "comment-added": {
        color: "var(--green-light)",
        icon: "comment",
        summary: (data, homeOwnerName, t) => buildCommentAddedSummary(data, t),
        target: story => ({nodeName: ":", href: `/post/${getStoryPostingId(story)}?comment=${story.remoteCommentId}`})
    },
    "remote-comment-added": {
        color: "var(--green-light)",
        icon: "comment",
        summary: (data, homeOwnerName, t) => buildRemoteCommentAddedSummary(data, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        }),
        sheriffFields: ["posting", "comments"]
    },
    "reply-comment": {
        color: "var(--green-light)",
        icon: "reply",
        summary: (data, homeOwnerName, t) => buildReplyCommentSummary(data, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        }),
        sheriffFields: ["posting", "comments"]
    },
    "comment-post-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        summary: (data, homeOwnerName, t) => buildCommentPostTaskFailedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "comment-update-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        summary: (data, homeOwnerName, t) => buildCommentUpdateTaskFailedSummary(data, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "posting-updated": {
        color: "var(--bs-green)",
        icon: "pen-alt",
        summary: (data, homeOwnerName, t) => buildPostingUpdatedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "posting-post-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        summary: (data, homeOwnerName, t) => buildPostingPostTaskFailedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: "/"})
    },
    "posting-update-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        summary: (data, homeOwnerName, t) => buildPostingUpdateTaskFailedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "posting-media-reaction-added-positive": {
        summary: (data, homeOwnerName, t) => buildPostingMediaReactionAddedSummary(data, false, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?media=${story.remoteMediaId}`
        })
    },
    "posting-media-reaction-added-negative": {
        summary: (data, homeOwnerName, t) => buildPostingMediaReactionAddedSummary(data, true, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?media=${story.remoteMediaId}`
        })
    },
    "comment-media-reaction-added-positive": {
        summary: (data, homeOwnerName, t) => buildCommentMediaReactionAddedSummary(data, false, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}&media=${story.remoteMediaId}`
        })
    },
    "comment-media-reaction-added-negative": {
        summary: (data, homeOwnerName, t) => buildCommentMediaReactionAddedSummary(data, true, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}&media=${story.remoteMediaId}`
        })
    },
    "posting-media-reaction-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        summary: (data, homeOwnerName, t) => buildPostingMediaReactionFailedSummary(data, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?media=${story.remoteMediaId}`
        })
    },
    "comment-media-reaction-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        summary: (data, homeOwnerName, t) => buildCommentMediaReactionFailedSummary(data, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}&media=${story.remoteMediaId}`
        })
    },
    "posting-subscribe-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        summary: (data, homeOwnerName, t) => buildPostingSubscribeTaskFailedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "posting-reaction-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        summary: (data, homeOwnerName, t) => buildPostingReactionTaskFailedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "comment-reaction-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        summary: (data, homeOwnerName, t) => buildCommentReactionTaskFailedSummary(data, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "friend-added": {
        color: "var(--bs-teal)",
        icon: "user",
        summary: (data, homeOwnerName, t) => buildFriendAddedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: "/"}),
        buttons: InstantStoryFriendButtons,
        buttonsAction: instantStoryFriendAction
    },
    "friend-deleted": {
        color: "var(--bs-teal)",
        icon: "user-slash",
        summary: (data, homeOwnerName, t) => buildFriendDeletedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: "/"})
    },
    "friend-group-deleted": {
        color: "var(--bs-teal)",
        icon: "user-times",
        summary: (data, homeOwnerName, t) => buildFriendGroupDeletedSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: "/"})
    },
    "asked-to-subscribe": {
        color: "var(--bs-indigo)",
        icon: "question",
        summary: (data, homeOwnerName, t) => buildAskedToSubscribeSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: "/"}),
        buttons: InstantStorySubscribeButtons,
        buttonsAction: instantStorySubscribeAction
    },
    "asked-to-friend": {
        color: "var(--bs-teal)",
        icon: "question",
        summary: (data, homeOwnerName, t) => buildAskedToFriendSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: "/"}),
        buttons: InstantStoryFriendGroupButtons,
        buttonsAction: instantStoryFriendGroupAction
    },
    "blocked-user": {
        color: "var(--incorrect)",
        icon: "handcuffs",
        summary: (data, homeOwnerName, t) => buildBlockedUserSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: "/"}),
        buttons: InstantStoryBlockedButtons
    },
    "unblocked-user": {
        color: "var(--correct)",
        icon: "handcuffs",
        summary: (data, homeOwnerName, t) => buildUnblockedUserSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: "/"})
    },
    "blocked-user-in-posting": {
        color: "var(--incorrect)",
        icon: "handcuffs",
        summary: (data, homeOwnerName, t) => buildBlockedUserInPostingSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`}),
        buttons: InstantStoryBlockedButtons
    },
    "unblocked-user-in-posting": {
        color: "var(--correct)",
        icon: "handcuffs",
        summary: (data, homeOwnerName, t) => buildUnblockedUserInPostingSummary(data, t),
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "sheriff-marked": {
        color: "var(--incorrect)",
        icon: "hat-cowboy",
        summary: (data, homeOwnerName, t) => buildSheriffMarkedSummary(data, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: story.remotePostingId == null
                ? "/"
                : story.remoteCommentId == null
                    ? `/post/${story.remotePostingId}`
                    : `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        }),
        buttons: InstantStorySheriffOrderButtons
    },
    "sheriff-unmarked": {
        color: "var(--correct)",
        icon: "hat-cowboy",
        summary: (data, homeOwnerName, t) => buildSheriffUnmarkedSummary(data, homeOwnerName, t),
        target: story => ({
            nodeName: story.remoteNodeName,
            href: story.remotePostingId == null
                ? "/"
                : story.remoteCommentId == null
                    ? `/post/${story.remotePostingId}`
                    : `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        }),
        buttons: InstantStorySheriffOrderButtons
    },
    "sheriff-complain-added": {
        color: "var(--bs-blue)",
        icon: "hat-cowboy",
        summary: (data, homeOwnerName, t) => buildSheriffComplainAddedSummary(t),
        target: story => ({
            nodeName: story.summaryNodeName,
            href: `/complains/${story.summaryData?.sheriff?.complainId}`
        })
    },
    "sheriff-complain-decided": {
        color: "var(--bs-indigo)",
        icon: "hat-cowboy",
        summary: (data, homeOwnerName, t) => buildSheriffComplainDecidedSummary(data, homeOwnerName, t),
        target: story => ({
            nodeName: story.summaryNodeName,
            href: `/complains/${story.summaryData?.sheriff?.complainId}`
        })
    }
};

function isStoryInfo(story: StoryInfo | ExtStoryInfo): story is StoryInfo {
    return "posting" in story;
}

function getStoryPostingId(story: StoryInfo | ExtStoryInfo): string | undefined {
    return isStoryInfo(story) ? story.posting?.id : story.postingId;
}

export function getInstantTypeDetails(storyType: StoryType): InstantTypeDetails | null {
    return INSTANT_TYPES[storyType] ?? null;
}

export function getInstantTarget(story: StoryInfo | ExtStoryInfo): InstantTarget {
    return getInstantTypeDetails(story.storyType)?.target(story) ?? {nodeName: ":", href: "/"};
}

export function getInstantSummary(story: StoryInfo | ExtStoryInfo, homeOwnerName: string | null): string {
    if (story.summaryData == null) {
        return "";
    }
    return getInstantTypeDetails(story.storyType)?.summary(story.summaryData, homeOwnerName, i18n.t) ?? "";
}

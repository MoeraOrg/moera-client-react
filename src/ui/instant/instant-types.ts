import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { StoryInfo, StoryType } from "api/node/api-types";
import { ClientAction } from "state/action";
import { ExtStoryInfo } from "state/feeds/state";
import { InstantStoryButtonsProps } from "ui/instant/buttons/InstantStoryButtons";
import InstantStorySubscribeButtons, {
    instantStorySubscribeAction
} from "ui/instant/buttons/InstantStorySubscribeButtons";
import InstantStoryFriendButtons, { instantStoryFriendAction } from "ui/instant/buttons/InstantStoryFriendButtons";
import InstantStoryFriendGroupButtons, {
    instantStoryFriendGroupAction
} from "ui/instant/buttons/InstantStoryFriendGroupButtons";

interface InstantTarget {
    nodeName: string | null | undefined;
    href: string;
}

type InstantTargetSupplier = (story: StoryInfo | ExtStoryInfo) => InstantTarget;

export type InstantStoryButtonsActionSupplier = (story: StoryInfo) => ClientAction | null | undefined;

interface InstantTypeDetails {
    color?: string;
    icon?: IconProp;
    target: InstantTargetSupplier;
    buttons?: React.ComponentType<InstantStoryButtonsProps>;
    buttonsAction?: InstantStoryButtonsActionSupplier;
}

const INSTANT_TYPES: Record<StoryType, InstantTypeDetails> = {
    "posting-added": {
        color: "var(--bs-green)",
        icon: "pen-alt",
        target: story => ({nodeName: ":", href: `/post/${getStoryPostingId(story)}`})
    },
    "reaction-added-positive": {
        target: story => ({nodeName: ":", href: `/post/${getStoryPostingId(story)}`})
    },
    "reaction-added-negative": {
        target: story => ({nodeName: ":", href: `/post/${getStoryPostingId(story)}`})
    },
    "comment-reaction-added-positive": {
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "comment-reaction-added-negative": {
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "mention-posting": {
        color: "var(--bs-blue)",
        icon: "at",
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "mention-comment": {
        color: "var(--bs-blue)",
        icon: "at",
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "subscriber-added": {
        color: "var(--bs-indigo)",
        icon: "eye",
        target: story => ({nodeName: story.remoteNodeName, href: "/"}),
        buttons: InstantStorySubscribeButtons,
        buttonsAction: instantStorySubscribeAction
    },
    "subscriber-deleted": {
        color: "var(--bs-indigo)",
        icon: "eye-slash",
        target: story => ({nodeName: story.remoteNodeName, href: "/"})
    },
    "comment-added": {
        color: "var(--green-light)",
        icon: "comment",
        target: story => ({nodeName: ":", href: `/post/${getStoryPostingId(story)}?comment=${story.remoteCommentId}`})
    },
    "remote-comment-added": {
        color: "var(--green-light)",
        icon: "comment",
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "reply-comment": {
        color: "var(--green-light)",
        icon: "reply",
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "comment-post-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "comment-update-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "posting-updated": {
        color: "var(--bs-green)",
        icon: "pen-alt",
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "posting-post-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        target: story => ({nodeName: story.remoteNodeName, href: "/"})
    },
    "posting-update-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "posting-media-reaction-added-positive": {
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?media=${story.remoteMediaId}`
        })
    },
    "posting-media-reaction-added-negative": {
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?media=${story.remoteMediaId}`
        })
    },
    "comment-media-reaction-added-positive": {
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}&media=${story.remoteMediaId}`
        })
    },
    "comment-media-reaction-added-negative": {
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}&media=${story.remoteMediaId}`
        })
    },
    "posting-media-reaction-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?media=${story.remoteMediaId}`
        })
    },
    "comment-media-reaction-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}&media=${story.remoteMediaId}`
        })
    },
    "posting-subscribe-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "posting-reaction-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        target: story => ({nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`})
    },
    "comment-reaction-task-failed": {
        color: "var(--incorrect)",
        icon: "exclamation-circle",
        target: story => ({
            nodeName: story.remoteNodeName,
            href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
        })
    },
    "friend-added": {
        color: "var(--bs-teal)",
        icon: "user",
        target: story => ({nodeName: story.remoteNodeName, href: "/"}),
        buttons: InstantStoryFriendButtons,
        buttonsAction: instantStoryFriendAction
    },
    "friend-deleted": {
        color: "var(--bs-teal)",
        icon: "user-slash",
        target: story => ({nodeName: story.remoteNodeName, href: "/"})
    },
    "friend-group-deleted": {
        color: "var(--bs-teal)",
        icon: "user-times",
        target: story => ({nodeName: story.remoteNodeName, href: "/"})
    },
    "asked-to-subscribe": {
        color: "var(--bs-indigo)",
        icon: "question",
        target: story => ({nodeName: story.remoteNodeName, href: "/"}),
        buttons: InstantStorySubscribeButtons,
        buttonsAction: instantStorySubscribeAction
    },
    "asked-to-friend": {
        color: "var(--bs-teal)",
        icon: "question",
        target: story => ({nodeName: story.remoteNodeName, href: "/"}),
        buttons: InstantStoryFriendGroupButtons,
        buttonsAction: instantStoryFriendGroupAction
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

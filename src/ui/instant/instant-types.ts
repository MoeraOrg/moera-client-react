import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { StoryInfo, StoryType } from "api/node/api-types";
import { ExtStoryInfo } from "state/feeds/state";

interface InstantTypeDetails {
    title?: string;
    color?: string;
    icon?: IconProp;
}

const INSTANT_TYPES: Record<StoryType, InstantTypeDetails> = {
    "posting-added": {
        title: "Post added",
        color: "var(--bs-green)",
        icon: "pen-alt"
    },
    "reaction-added-positive": {
    },
    "reaction-added-negative": {
    },
    "comment-reaction-added-positive": {
    },
    "comment-reaction-added-negative": {
    },
    "mention-posting": {
        title: "Mention in post",
        color: "var(--bs-blue)",
        icon: "at"
    },
    "mention-comment": {
        title: "Mention in comment",
        color: "var(--bs-blue)",
        icon: "at"
    },
    "subscriber-added": {
        title: "Subscribed",
        color: "var(--bs-indigo)",
        icon: "eye"
    },
    "subscriber-deleted": {
        title: "Unsubscribed",
        color: "var(--bs-indigo)",
        icon: "eye-slash"
    },
    "comment-added": {
        title: "Commented",
        color: "var(--green-light)",
        icon: "comment"
    },
    "remote-comment-added": {
        title: "Commented",
        color: "var(--green-light)",
        icon: "comment"
    },
    "reply-comment": {
        title: "Reply to comment",
        color: "var(--green-light)",
        icon: "reply"
    },
    "comment-post-task-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    },
    "comment-update-task-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    },
    "posting-updated": {
        title: "Post updated",
        color: "var(--bs-green)",
        icon: "pen-alt"
    },
    "posting-post-task-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    },
    "posting-update-task-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    },
    "posting-media-reaction-added-positive": {
    },
    "posting-media-reaction-added-negative": {
    },
    "comment-media-reaction-added-positive": {
    },
    "comment-media-reaction-added-negative": {
    },
    "posting-media-reaction-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    },
    "comment-media-reaction-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    },
    "posting-subscribe-task-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    },
    "posting-reaction-task-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    },
    "comment-reaction-task-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    }
};

export function getInstantTypeDetails(storyType: StoryType): InstantTypeDetails | null {
    return INSTANT_TYPES[storyType] ?? null;
}

function isStoryInfo(story: StoryInfo | ExtStoryInfo): story is StoryInfo {
    return "posting" in story;
}

interface InstantTarget {
    nodeName: string | null | undefined;
    href: string;
}

export function getInstantTarget(story: StoryInfo | ExtStoryInfo): InstantTarget {
    const postingId = isStoryInfo(story) ? story.posting?.id : story.postingId;

    switch(story.storyType) {
        case "reaction-added-positive":
        case "reaction-added-negative":
            return {nodeName: ":", href: `/post/${postingId}`}
        case "mention-posting":
        case "comment-post-task-failed":
        case "posting-updated":
        case "posting-update-task-failed":
        case "posting-subscribe-task-failed":
        case "posting-reaction-task-failed":
            return {nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`}
        case "subscriber-added":
        case "subscriber-deleted":
        case "posting-post-task-failed":
            return {nodeName: story.remoteNodeName, href: "/"}
        case "comment-added":
            return {nodeName: ":", href: `/post/${postingId}?comment=${story.remoteCommentId}`}
        case "mention-comment":
        case "reply-comment":
        case "comment-reaction-added-positive":
        case "comment-reaction-added-negative":
        case "comment-reaction-task-failed":
        case "remote-comment-added":
        case "comment-update-task-failed":
            return {
                nodeName: story.remoteNodeName,
                href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
            }
        case "posting-media-reaction-added-positive":
        case "posting-media-reaction-added-negative":
        case "posting-media-reaction-failed":
            return {
                nodeName: story.remoteNodeName,
                href: `/post/${story.remotePostingId}?media=${story.remoteMediaId}`
            }
        case "comment-media-reaction-added-positive":
        case "comment-media-reaction-added-negative":
        case "comment-media-reaction-failed":
            return {
                nodeName: story.remoteNodeName,
                href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}&media=${story.remoteMediaId}`
            }
        default:
            return {nodeName: ":", href: "/"}
    }
}

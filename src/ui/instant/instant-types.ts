import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { StoryInfo, StoryType } from "api/node/api-types";
import { ExtStoryInfo } from "state/feeds/state";

interface InstantTypeDetails {
    title: string;
    color: string;
    icon: IconProp;
}

const INSTANT_TYPES: Record<StoryType, InstantTypeDetails> = {
    "posting-added": {
        title: "Post added",
        color: "var(--green)",
        icon: "pen-alt"
    },
    "reaction-added-positive": {
        title: "Post supported",
        color: "var(--correct)",
        icon: "thumbs-up"
    },
    "reaction-added-negative": {
        title: "Post opposed",
        color: "var(--incorrect)",
        icon: "thumbs-down"
    },
    "comment-reaction-added-positive": {
        title: "Comment supported",
        color: "var(--correct)",
        icon: "thumbs-up"
    },
    "comment-reaction-added-negative": {
        title: "Comment opposed",
        color: "var(--incorrect)",
        icon: "thumbs-down"
    },
    "mention-posting": {
        title: "Mention in post",
        color: "var(--blue)",
        icon: "at"
    },
    "mention-comment": {
        title: "Mention in comment",
        color: "var(--blue)",
        icon: "at"
    },
    "subscriber-added": {
        title: "Subscribed",
        color: "var(--blue)",
        icon: "eye"
    },
    "subscriber-deleted": {
        title: "Unsubscribed",
        color: "var(--blue)",
        icon: "eye-slash"
    },
    "comment-added": {
        title: "Commented",
        color: "var(--green)",
        icon: "comment"
    },
    "remote-comment-added": {
        title: "Commented",
        color: "var(--green)",
        icon: "comment"
    },
    "reply-comment": {
        title: "Reply to comment",
        color: "var(--green)",
        icon: "reply"
    },
    "posting-task-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    },
    "comment-task-failed": {
        title: "Operation failed",
        color: "var(--incorrect)",
        icon: "exclamation-circle"
    },
    "posting-updated": {
        title: "Post updated",
        color: "var(--green)",
        icon: "pen-alt"
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
        case "posting-task-failed":
        case "posting-updated":
            return {nodeName: story.remoteNodeName, href: `/post/${story.remotePostingId}`}
        case "subscriber-added":
        case "subscriber-deleted":
            return {nodeName: story.remoteNodeName, href: "/"}
        case "comment-added":
            return {nodeName: ":", href: `/post/${postingId}?comment=${story.remoteCommentId}`}
        case "mention-comment":
        case "reply-comment":
        case "comment-reaction-added-positive":
        case "comment-reaction-added-negative":
        case "remote-comment-added":
        case "comment-task-failed":
            return {
                nodeName: story.remoteNodeName,
                href: `/post/${story.remotePostingId}?comment=${story.remoteCommentId}`
            }
        default:
            return {nodeName: ":", href: "/"}
    }
}

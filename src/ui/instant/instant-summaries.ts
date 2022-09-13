import { NodeName } from "api";
import {
    StorySummaryData,
    StorySummaryEntry,
    StorySummaryNode,
    StorySummaryReaction,
    StoryType
} from "api/node/api-types";
import { htmlEntities } from "util/html";
import { getFeedTitle } from "ui/feed/feeds";

function spanNodeName(nodeName: string, text: string): string {
    return `<span class="node-name" data-nodename="${htmlEntities(nodeName)}">${text}</span>`;
}

function formatNodeName(node: StorySummaryNode | StorySummaryEntry | StorySummaryReaction | null | undefined): string {
    const {ownerName, ownerFullName} = node ?? {};
    if (ownerName == null) {
        return "&lt;unknown&gt;";
    }
    return spanNodeName(ownerName, ownerFullName != null ? ownerFullName : NodeName.shorten(ownerName));
}

function formatReaction(reaction: StorySummaryReaction | null | undefined): string {
    return String.fromCodePoint(reaction?.emoji ?? 0x1f44d) + " " + formatNodeName(reaction);
}

function formatHeading(entry: StorySummaryEntry | null | undefined): string {
    return "\"" + (htmlEntities(entry?.heading) ?? "") + "\"";
}

function formatList<T>(entries: T[] | null | undefined, total: number | null | undefined,
                       formatter: (entry: T) => string): string {
    let summary = "";
    if (entries != null && total != null) {
        if (entries.length > 0) {
            summary += formatter(entries[0]);
        }
        if (entries.length > 1) {
            summary += total === 2 ? " and " : ", ";
            summary += formatter(entries[1]);
        }
        if (total > 2) {
            summary += total === 3 ? " and 1 other" : ` and ${total} others`;
        }
    }
    return summary;
}

function formatListOfComments(data: StorySummaryData): string {
    return formatList(data.comments, data.totalComments, formatNodeName);
}

function formatListOfReactions(data: StorySummaryData): string {
    return formatList(data.reactions, data.totalReactions, formatReaction);
}

type IsTheirPredicate = (data: StorySummaryData, node: StorySummaryNode | StorySummaryEntry) => boolean;

function isByFirstReactionOwner(data: StorySummaryData, node: StorySummaryNode | StorySummaryEntry): boolean {
    return data.totalReactions === 1 && data.reactions?.length === 1 && node?.ownerName === data.reactions[0].ownerName;
}

function isByCommentOwner(data: StorySummaryData, node: StorySummaryNode | StorySummaryEntry): boolean {
    return node.ownerName === data.comment?.ownerName;
}

function isByFirstCommentOwner(data: StorySummaryData, node: StorySummaryNode | StorySummaryEntry): boolean {
    return data.totalComments === 1 && data.comments?.length === 1 && node?.ownerName === data.comments[0].ownerName;
}

function formatSomebodysPosting(data: StorySummaryData, homeOwnerName: string | null,
                                isTheir: IsTheirPredicate): string {
    if (data.posting?.ownerName === homeOwnerName) {
        return "your post";
    } else if (data.posting != null && isTheir(data, data.posting)) {
        return "their post";
    } else {
        return `${formatNodeName(data.posting)} post`;
    }
}

function formatSomebodysNode(data: StorySummaryData, homeOwnerName: string | null,
                             isTheir: IsTheirPredicate): string {
    if (data.node?.ownerName === homeOwnerName) {
        return "your node";
    } else if (data.node != null && isTheir(data, data.node)) {
        return "their node";
    } else {
        return `${formatNodeName(data.posting)} node`;
    }
}

function formatReason(data: StorySummaryData): string {
    switch (data.subscriptionReason) {
        default:
        case "user":
            return "you subscribed to";
        case "mention":
            return "you have been mentioned in";
        case "comment":
            return "you commented";
    }
}

function buildReactionAddedSummary(data: StorySummaryData, negative: boolean): string {
    let summary = formatListOfReactions(data);
    summary += !negative ? " supported" : " opposed";
    summary += ` your post ${formatHeading(data.posting)}`
    return summary;
}

function buildMentionPostingSummary(data: StorySummaryData): string {
    return `${formatNodeName(data.posting)} mentioned you in a post ${formatHeading(data.posting)}`;
}

function buildSubscriberAddedSummary(data: StorySummaryData): string {
    return `${formatNodeName(data.node)} subscribed to your ${getFeedTitle(data.feedName)}`;
}

function buildSubscriberDeletedSummary(data: StorySummaryData): string {
    return `${formatNodeName(data.node)} unsubscribed from your ${getFeedTitle(data.feedName)}`;
}

function buildCommentAddedSummary(data: StorySummaryData): string {
    return `${formatListOfComments(data)} commented on your post ${formatHeading(data.posting)}`;
}

function buildMentionCommentSummary(data: StorySummaryData, homeOwnerName: string | null): string {
    return `${formatNodeName(data.comment)} mentioned you in a comment ${formatHeading(data.comment)} on`
        + ` ${formatSomebodysPosting(data, homeOwnerName, isByCommentOwner)}`
        + ` ${formatHeading(data.posting)}`;
}

function buildReplyCommentSummary(data: StorySummaryData, homeOwnerName: string | null): string {
    return `${formatListOfComments(data)} replied to your comment ${formatHeading(data.comment)} on `
        + formatSomebodysPosting(data, homeOwnerName, isByFirstCommentOwner);
}

function buildCommentReactionAddedSummary(data: StorySummaryData, negative: boolean,
                                          homeOwnerName: string | null): string {
    let summary = formatListOfReactions(data);
    summary += !negative ? " supported" : " opposed";
    summary += ` your comment ${formatHeading(data.comment)} on `
        + formatSomebodysPosting(data, homeOwnerName, isByFirstReactionOwner);
    return summary;
}

function buildRemoteCommentAddedSummary(data: StorySummaryData, homeOwnerName: string | null): string {
    return `${formatListOfComments(data)} commented on ${formatSomebodysPosting(data, homeOwnerName, isByCommentOwner)}`
        + ` ${formatReason(data)} ${formatHeading(data.posting)}`;
}

function buildCommentPostTaskFailedSummary(data: StorySummaryData): string {
    return `Failed to add a comment to ${formatNodeName(data.posting)} post ${formatHeading(data.posting)}`;
}

function buildCommentUpdateTaskFailedSummary(data: StorySummaryData): string {
    return `Failed to sign the comment ${formatHeading(data.comment)} to ${formatNodeName(data.posting)}`
        + ` post ${formatHeading(data.posting)}`;
}

function buildPostingUpdatedSummary(data: StorySummaryData): string {
    let summary = `${formatNodeName(data.posting)} updated their post ${formatHeading(data.posting)}`;
    if (data.description) {
        summary += `: ${data.description}`;
    }
    return summary;
}

function buildPostingPostTaskFailedSummary(data: StorySummaryData): string {
    return `Failed to add your post to ${formatNodeName(data.node)} blog`;
}

function buildPostingUpdateTaskFailedSummary(data: StorySummaryData): string {
    return `Failed to sign your post ${formatHeading(data.posting)} in ${formatNodeName(data.node)} blog`;
}

function buildPostingMediaReactionAddedSummary(data: StorySummaryData, negative: boolean,
                                               homeOwnerName: string | null): string {
    let summary = formatListOfReactions(data);
    summary += !negative ? " supported" : " opposed";
    summary += ` a media in your post ${formatHeading(data.posting)} in `
        + formatSomebodysNode(data, homeOwnerName, isByFirstReactionOwner);
    return summary;
}

function buildCommentMediaReactionAddedSummary(data: StorySummaryData, negative: boolean,
                                               homeOwnerName: string | null): string {
    let summary = formatListOfReactions(data);
    summary += !negative ? " supported" : " opposed";
    summary += ` a media in your comment ${formatHeading(data.comment)} on `
        + formatSomebodysPosting(data, homeOwnerName, isByFirstReactionOwner);
    return summary;
}

function buildPostingMediaReactionFailedSummary(data: StorySummaryData): string {
    return `Failed to sign a reaction to a media in ${formatNodeName(data.posting)} post ${formatHeading(data.posting)}`;
}

function buildCommentMediaReactionFailedSummary(data: StorySummaryData): string {
    return `Failed to sign a reaction to a media in ${formatNodeName(data.comment)} comment`
        + ` ${formatHeading(data.comment)} to ${formatNodeName(data.posting)} post ${formatHeading(data.posting)}`;
}

function buildPostingSubscribeTaskFailedSummary(data: StorySummaryData): string {
    return `Failed to subscribe to comments to ${formatNodeName(data.posting)} post ${formatHeading(data.posting)}`;
}

function buildPostingReactionTaskFailedSummary(data: StorySummaryData): string {
    return `Failed to sign a reaction to ${formatNodeName(data.posting)} post ${formatHeading(data.posting)}`;
}

function buildCommentReactionTaskFailedSummary(data: StorySummaryData): string {
    return `Failed to sign a reaction to ${formatNodeName(data.comment)} comment`
        + ` ${formatHeading(data.comment)} to ${formatNodeName(data.posting)} post ${formatHeading(data.posting)}`;
}

export function buildSummary(type: StoryType, data: StorySummaryData, homeOwnerName: string | null): string {
    switch (type) {
        case "reaction-added-positive":
            return buildReactionAddedSummary(data, false);
        case "reaction-added-negative":
            return buildReactionAddedSummary(data, true);
        case "mention-posting":
            return buildMentionPostingSummary(data);
        case "subscriber-added":
            return buildSubscriberAddedSummary(data);
        case "subscriber-deleted":
            return buildSubscriberDeletedSummary(data);
        case "comment-added":
            return buildCommentAddedSummary(data);
        case "mention-comment":
            return buildMentionCommentSummary(data, homeOwnerName);
        case "reply-comment":
            return buildReplyCommentSummary(data, homeOwnerName);
        case "comment-reaction-added-positive":
            return buildCommentReactionAddedSummary(data, false, homeOwnerName);
        case "comment-reaction-added-negative":
            return buildCommentReactionAddedSummary(data, true, homeOwnerName);
        case "remote-comment-added":
            return buildRemoteCommentAddedSummary(data, homeOwnerName);
        case "comment-post-task-failed":
            return buildCommentPostTaskFailedSummary(data);
        case "comment-update-task-failed":
            return buildCommentUpdateTaskFailedSummary(data);
        case "posting-updated":
            return buildPostingUpdatedSummary(data);
        case "posting-post-task-failed":
            return buildPostingPostTaskFailedSummary(data);
        case "posting-update-task-failed":
            return buildPostingUpdateTaskFailedSummary(data);
        case "posting-media-reaction-added-positive":
            return buildPostingMediaReactionAddedSummary(data, false, homeOwnerName);
        case "posting-media-reaction-added-negative":
            return buildPostingMediaReactionAddedSummary(data, true, homeOwnerName);
        case "comment-media-reaction-added-positive":
            return buildCommentMediaReactionAddedSummary(data, false, homeOwnerName);
        case "comment-media-reaction-added-negative":
            return buildCommentMediaReactionAddedSummary(data, true, homeOwnerName);
        case "posting-media-reaction-failed":
            return buildPostingMediaReactionFailedSummary(data);
        case "comment-media-reaction-failed":
            return buildCommentMediaReactionFailedSummary(data);
        case "posting-subscribe-task-failed":
            return buildPostingSubscribeTaskFailedSummary(data);
        case "posting-reaction-task-failed":
            return buildPostingReactionTaskFailedSummary(data);
        case "comment-reaction-task-failed":
            return buildCommentReactionTaskFailedSummary(data);
        default:
            return "";
    }
}

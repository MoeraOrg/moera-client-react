import i18n from 'i18next';
import { TFunction } from 'react-i18next';

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
import { tGender } from "i18n";

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
                       formatter: (entry: T) => string, t: TFunction): string {
    let summary = "";
    if (entries != null && total != null) {
        if (entries.length > 0) {
            summary += formatter(entries[0]);
        }
        if (entries.length > 1) {
            summary += total === 2 ? ` ${t("instant-summary.and")} ` : ", ";
            summary += formatter(entries[1]);
        }
        if (total > 2) {
            summary += " " + t("instant-summary.and-others", {count: total - 2});
        }
    }
    return summary;
}

function firstGender(entries: (StorySummaryEntry | StorySummaryReaction)[] | null | undefined): string {
    return tGender(entries == null || entries.length === 0 ? null : entries[0].ownerGender);
}

function formatListOfComments(data: StorySummaryData, t: TFunction): string {
    return formatList(data.comments, data.totalComments, formatNodeName, t);
}

function formatListOfReactions(data: StorySummaryData, negative: boolean, t: TFunction): string {
    return formatList(data.reactions, data.totalReactions, formatReaction, t) + " "
        + t(!negative ? "instant-summary.supported" : "instant-summary.opposed", {
            count: data.totalReactions ?? 1,
            gender: firstGender(data.reactions)
        });
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
                                isTheir: IsTheirPredicate, theirGender: string | null | undefined,
                                t: TFunction): string {
    if (data.posting?.ownerName === homeOwnerName) {
        return t("instant-summary.your-post");
    } else if (data.posting != null && isTheir(data, data.posting)) {
        return t("instant-summary.their-post", {gender: tGender(theirGender)});
    } else {
        return t("instant-summary.node-post", {node: formatNodeName(data.posting)});
    }
}

function formatOnSomebodysPosting(data: StorySummaryData, homeOwnerName: string | null,
                                  isTheir: IsTheirPredicate, theirGender: string | null | undefined,
                                  t: TFunction): string {
    if (data.posting?.ownerName === homeOwnerName) {
        return t("instant-summary.on-your-post");
    } else if (data.posting != null && isTheir(data, data.posting)) {
        return t("instant-summary.on-their-post", tGender(theirGender));
    } else {
        return t("instant-summary.on-node-post", {node: formatNodeName(data.posting)});
    }
}

function formatInSomebodysNode(data: StorySummaryData, homeOwnerName: string | null,
                               isTheir: IsTheirPredicate, theirGender: string | null | undefined,
                               t: TFunction): string {
    if (data.node?.ownerName === homeOwnerName) {
        return t("instant-summary.in-your-blog");
    } else if (data.node != null && isTheir(data, data.node)) {
        return t("instant-summary.in-their-blog", {gender: tGender(theirGender)});
    } else {
        return t("instant-summary.in-node-blog", {node: formatNodeName(data.posting)});
    }
}

function formatReason(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.reason." + (data.subscriptionReason ?? "user"));
}

function buildReactionAddedSummary(data: StorySummaryData, negative: boolean, t: TFunction): string {
    return t("instant-summary.story.reaction-added", {
        reactions: formatListOfReactions(data, negative, t),
        heading: formatHeading(data.posting)
    });
}

function buildMentionPostingSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.mention-posting", {
        node: formatNodeName(data.posting),
        nodeGender: tGender(data.posting?.ownerGender),
        heading: formatHeading(data.posting)
    });
}

function buildSubscriberAddedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.subscriber-added", {
        node: formatNodeName(data.node),
        gender: tGender(data.node?.ownerGender),
        feed: getFeedTitle(data.feedName, t)
    });
}

function buildSubscriberDeletedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.subscriber-deleted", {
        node: formatNodeName(data.node),
        gender: tGender(data.node?.ownerGender),
        feed: getFeedTitle(data.feedName, t)
    });
}

function buildCommentAddedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.comment-added", {
        comments: formatListOfComments(data, t),
        count: data.totalComments ?? 1,
        gender: firstGender(data.comments),
        heading: formatHeading(data.posting)
    });
}

function buildMentionCommentSummary(data: StorySummaryData, homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.mention-comment", {
        node: formatNodeName(data.comment),
        nodeGender: tGender(data.comment?.ownerGender),
        commentHeading: formatHeading(data.comment),
        posting: formatOnSomebodysPosting(data, homeOwnerName, isByCommentOwner, data.posting?.ownerGender, t),
        postingHeading: formatHeading(data.posting)
    });
}

function buildReplyCommentSummary(data: StorySummaryData, homeOwnerName: string | null, t: TFunction): string {
    console.log(data);
    return t("instant-summary.story.reply-comment", {
        replies: formatListOfComments(data, t),
        count: data.totalComments ?? 1,
        gender: firstGender(data.comments),
        heading: formatHeading(data.repliedTo),
        posting: formatOnSomebodysPosting(data, homeOwnerName, isByFirstCommentOwner, data.posting?.ownerGender, t)
    });
}

function buildCommentReactionAddedSummary(data: StorySummaryData, negative: boolean,
                                          homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.comment-reaction-added", {
        reactions: formatListOfReactions(data, negative, t),
        heading: formatHeading(data.comment),
        posting: formatOnSomebodysPosting(data, homeOwnerName, isByFirstReactionOwner, data.posting?.ownerGender, t)
    });
}

function buildRemoteCommentAddedSummary(data: StorySummaryData, homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.remote-comment-added", {
        comments: formatListOfComments(data, t),
        count: data.totalComments ?? 1,
        gender: firstGender(data.comments),
        posting: formatSomebodysPosting(data, homeOwnerName, isByFirstCommentOwner, data.posting?.ownerGender, t),
        reason: formatReason(data, t),
        heading: formatHeading(data.posting)
    });
}

function buildCommentPostTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.comment-post-task-failed", {
        node: formatNodeName(data.posting),
        heading: formatHeading(data.posting)
    });
}

function buildCommentUpdateTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.comment-update-task-failed", {
        commentHeading: formatHeading(data.comment),
        node: formatNodeName(data.posting),
        postingHeading: formatHeading(data.posting)
    });
}

function buildPostingUpdatedSummary(data: StorySummaryData, t: TFunction): string {
    let summary = t("instant-summary.story.posting-updated", {
        node: formatNodeName(data.posting),
        nodeGender: tGender(data.posting?.ownerGender),
        heading: formatHeading(data.posting)
    });
    if (data.description) {
        summary += `: ${data.description}`;
    }
    return summary;
}

function buildPostingPostTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.posting-post-task-failed", {
        node: formatNodeName(data.node)
    });
}

function buildPostingUpdateTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.posting-update-task-failed", {
        heading: formatHeading(data.posting),
        node: formatNodeName(data.node)
    });
}

function buildPostingMediaReactionAddedSummary(data: StorySummaryData, negative: boolean,
                                               homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.posting-media-reaction-added", {
        reactions: formatListOfReactions(data, negative, t),
        heading: formatHeading(data.posting),
        node: formatInSomebodysNode(data, homeOwnerName, isByFirstReactionOwner, data.posting?.ownerGender, t)
    });
}

function buildCommentMediaReactionAddedSummary(data: StorySummaryData, negative: boolean,
                                               homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.comment-media-reaction-added", {
        reactions: formatListOfReactions(data, negative, t),
        heading: formatHeading(data.comment),
        posting: formatOnSomebodysPosting(data, homeOwnerName, isByFirstReactionOwner, data.posting?.ownerGender, t)
    });
}

function buildPostingMediaReactionFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.posting-media-reaction-failed", {
        node: formatNodeName(data.posting),
        heading: formatHeading(data.posting)
    });
}

function buildCommentMediaReactionFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.comment-media-reaction-failed", {
        commentNode: formatNodeName(data.comment),
        commentHeading: formatHeading(data.comment),
        postingNode: formatNodeName(data.posting),
        postingHeading: formatHeading(data.posting)
    });
}

function buildPostingSubscribeTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.posting-subscribe-task-failed", {
        node: formatNodeName(data.posting),
        heading: formatHeading(data.posting)
    });
}

function buildPostingReactionTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.posting-reaction-task-failed", {
        node: formatNodeName(data.posting),
        heading: formatHeading(data.posting)
    });
}

function buildCommentReactionTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.comment-reaction-task-failed", {
        commentNode: formatNodeName(data.comment),
        commentHeading: formatHeading(data.comment),
        postingNode: formatNodeName(data.posting),
        postingHeading: formatHeading(data.posting)
    });
}

export function buildSummary(type: StoryType, data: StorySummaryData, homeOwnerName: string | null): string {
    switch (type) {
        case "reaction-added-positive":
            return buildReactionAddedSummary(data, false, i18n.t);
        case "reaction-added-negative":
            return buildReactionAddedSummary(data, true, i18n.t);
        case "mention-posting":
            return buildMentionPostingSummary(data, i18n.t);
        case "subscriber-added":
            return buildSubscriberAddedSummary(data, i18n.t);
        case "subscriber-deleted":
            return buildSubscriberDeletedSummary(data, i18n.t);
        case "comment-added":
            return buildCommentAddedSummary(data, i18n.t);
        case "mention-comment":
            return buildMentionCommentSummary(data, homeOwnerName, i18n.t);
        case "reply-comment":
            return buildReplyCommentSummary(data, homeOwnerName, i18n.t);
        case "comment-reaction-added-positive":
            return buildCommentReactionAddedSummary(data, false, homeOwnerName, i18n.t);
        case "comment-reaction-added-negative":
            return buildCommentReactionAddedSummary(data, true, homeOwnerName, i18n.t);
        case "remote-comment-added":
            return buildRemoteCommentAddedSummary(data, homeOwnerName, i18n.t);
        case "comment-post-task-failed":
            return buildCommentPostTaskFailedSummary(data, i18n.t);
        case "comment-update-task-failed":
            return buildCommentUpdateTaskFailedSummary(data, i18n.t);
        case "posting-updated":
            return buildPostingUpdatedSummary(data, i18n.t);
        case "posting-post-task-failed":
            return buildPostingPostTaskFailedSummary(data, i18n.t);
        case "posting-update-task-failed":
            return buildPostingUpdateTaskFailedSummary(data, i18n.t);
        case "posting-media-reaction-added-positive":
            return buildPostingMediaReactionAddedSummary(data, false, homeOwnerName, i18n.t);
        case "posting-media-reaction-added-negative":
            return buildPostingMediaReactionAddedSummary(data, true, homeOwnerName, i18n.t);
        case "comment-media-reaction-added-positive":
            return buildCommentMediaReactionAddedSummary(data, false, homeOwnerName, i18n.t);
        case "comment-media-reaction-added-negative":
            return buildCommentMediaReactionAddedSummary(data, true, homeOwnerName, i18n.t);
        case "posting-media-reaction-failed":
            return buildPostingMediaReactionFailedSummary(data, i18n.t);
        case "comment-media-reaction-failed":
            return buildCommentMediaReactionFailedSummary(data, i18n.t);
        case "posting-subscribe-task-failed":
            return buildPostingSubscribeTaskFailedSummary(data, i18n.t);
        case "posting-reaction-task-failed":
            return buildPostingReactionTaskFailedSummary(data, i18n.t);
        case "comment-reaction-task-failed":
            return buildCommentReactionTaskFailedSummary(data, i18n.t);
        default:
            return "";
    }
}

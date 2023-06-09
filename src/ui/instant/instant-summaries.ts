import { TFunction } from 'react-i18next';

import { NodeName } from "api";
import { StorySummaryData, StorySummaryEntry, StorySummaryNode, StorySummaryReaction } from "api/node/api-types";
import { getFeedTitle } from "ui/feed/feeds";
import { htmlEntities } from "util/html";
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
    let emoji = reaction?.emoji ?? 0x1f44d;
    if (emoji === 0x1f620) {
        emoji = 0x1f92c;
    }
    return String.fromCodePoint(emoji) + " " + formatNodeName(reaction);
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
        return t("instant-summary.on-their-post", {gender: tGender(theirGender)});
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

function formatBlockedOperations(data: StorySummaryData, t: TFunction): string {
    if (data.blocked?.operations != null) {
        if (data.blocked.operations.includes("reaction")) {
            if (!data.blocked.operations.includes("comment")) {
                return t("instant-summary.blocked-reaction");
            }
        } else {
            if (data.blocked.operations.includes("comment")) {
                return t("instant-summary.blocked-comment");
            }
        }
    }
    return t("instant-summary.blocked-reaction-and-comment");
}

function formatBlockedPeriod(data: StorySummaryData, t: TFunction): string {
    if (data.blocked?.period == null) {
        return "";
    }
    return t("instant-summary.blocked-period", {days: Math.ceil(data.blocked.period / 86400)});
}

export function formatSheriffTarget(data: StorySummaryData, homeOwnerName: string | null, t: TFunction): string {
    if (data.posting == null) {
        return t("instant-summary.target-your-blog");
    } else if (data.comment == null) {
        return t("instant-summary.target-your-post", {
            heading: formatHeading(data.posting),
        });
    } else {
        return t("instant-summary.target-your-comment", {
            heading: formatHeading(data.comment),
            posting: formatOnSomebodysPosting(data, homeOwnerName, isByCommentOwner, data.posting?.ownerGender, t)
        });
    }
}

/* * */

export function buildReactionAddedSummary(data: StorySummaryData, negative: boolean, t: TFunction): string {
    return t("instant-summary.story.reaction-added", {
        reactions: formatListOfReactions(data, negative, t),
        heading: formatHeading(data.posting)
    });
}

export function buildMentionPostingSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.mention-posting", {
        node: formatNodeName(data.posting),
        nodeGender: tGender(data.posting?.ownerGender),
        heading: formatHeading(data.posting)
    });
}

export function buildSubscriberAddedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.subscriber-added", {
        node: formatNodeName(data.node),
        gender: tGender(data.node?.ownerGender),
        feed: getFeedTitle(data.feedName, t)
    });
}

export function buildSubscriberDeletedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.subscriber-deleted", {
        node: formatNodeName(data.node),
        gender: tGender(data.node?.ownerGender),
        feed: getFeedTitle(data.feedName, t)
    });
}

export function buildCommentAddedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.comment-added", {
        comments: formatListOfComments(data, t),
        count: data.totalComments ?? 1,
        gender: firstGender(data.comments),
        heading: formatHeading(data.posting)
    });
}

export function buildMentionCommentSummary(data: StorySummaryData, homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.mention-comment", {
        node: formatNodeName(data.comment),
        nodeGender: tGender(data.comment?.ownerGender),
        commentHeading: formatHeading(data.comment),
        posting: formatOnSomebodysPosting(data, homeOwnerName, isByCommentOwner, data.posting?.ownerGender, t),
        postingHeading: formatHeading(data.posting)
    });
}

export function buildReplyCommentSummary(data: StorySummaryData, homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.reply-comment", {
        replies: formatListOfComments(data, t),
        count: data.totalComments ?? 1,
        gender: firstGender(data.comments),
        heading: formatHeading(data.repliedTo),
        posting: formatOnSomebodysPosting(data, homeOwnerName, isByFirstCommentOwner, data.posting?.ownerGender, t)
    });
}

export function buildCommentReactionAddedSummary(data: StorySummaryData, negative: boolean,
                                                 homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.comment-reaction-added", {
        reactions: formatListOfReactions(data, negative, t),
        heading: formatHeading(data.comment),
        posting: formatOnSomebodysPosting(data, homeOwnerName, isByFirstReactionOwner, data.posting?.ownerGender, t)
    });
}

export function buildRemoteCommentAddedSummary(data: StorySummaryData,
                                               homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.remote-comment-added", {
        comments: formatListOfComments(data, t),
        count: data.totalComments ?? 1,
        gender: firstGender(data.comments),
        posting: formatSomebodysPosting(data, homeOwnerName, isByFirstCommentOwner, data.posting?.ownerGender, t),
        reason: formatReason(data, t),
        heading: formatHeading(data.posting)
    });
}

export function buildCommentPostTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.comment-post-task-failed", {
        node: formatNodeName(data.posting),
        heading: formatHeading(data.posting)
    });
}

export function buildCommentUpdateTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.comment-update-task-failed", {
        commentHeading: formatHeading(data.comment),
        node: formatNodeName(data.posting),
        postingHeading: formatHeading(data.posting)
    });
}

export function buildPostingUpdatedSummary(data: StorySummaryData, t: TFunction): string {
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

export function buildPostingPostTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.posting-post-task-failed", {
        node: formatNodeName(data.node)
    });
}

export function buildPostingUpdateTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.posting-update-task-failed", {
        heading: formatHeading(data.posting),
        node: formatNodeName(data.node)
    });
}

export function buildPostingMediaReactionAddedSummary(data: StorySummaryData, negative: boolean,
                                                      homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.posting-media-reaction-added", {
        reactions: formatListOfReactions(data, negative, t),
        heading: formatHeading(data.posting),
        node: formatInSomebodysNode(data, homeOwnerName, isByFirstReactionOwner, data.posting?.ownerGender, t)
    });
}

export function buildCommentMediaReactionAddedSummary(data: StorySummaryData, negative: boolean,
                                                      homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.comment-media-reaction-added", {
        reactions: formatListOfReactions(data, negative, t),
        heading: formatHeading(data.comment),
        posting: formatOnSomebodysPosting(data, homeOwnerName, isByFirstReactionOwner, data.posting?.ownerGender, t)
    });
}

export function buildPostingMediaReactionFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.posting-media-reaction-failed", {
        node: formatNodeName(data.posting),
        heading: formatHeading(data.posting)
    });
}

export function buildCommentMediaReactionFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.comment-media-reaction-failed", {
        commentNode: formatNodeName(data.comment),
        commentHeading: formatHeading(data.comment),
        postingNode: formatNodeName(data.posting),
        postingHeading: formatHeading(data.posting)
    });
}

export function buildPostingSubscribeTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.posting-subscribe-task-failed", {
        node: formatNodeName(data.posting),
        heading: formatHeading(data.posting)
    });
}

export function buildPostingReactionTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.posting-reaction-task-failed", {
        node: formatNodeName(data.posting),
        heading: formatHeading(data.posting)
    });
}

export function buildCommentReactionTaskFailedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.comment-reaction-task-failed", {
        commentNode: formatNodeName(data.comment),
        commentHeading: formatHeading(data.comment),
        postingNode: formatNodeName(data.posting),
        postingHeading: formatHeading(data.posting)
    });
}

export function buildFriendAddedSummary(data: StorySummaryData, t: TFunction): string {
    if (data.friendGroup?.title == null || data.friendGroup.title === "t:friends") {
        return t("instant-summary.story.friend-added-to-friends", {
            node: formatNodeName(data.node),
            gender: tGender(data.node?.ownerGender)
        });
    } else {
        return t("instant-summary.story.friend-added", {
            node: formatNodeName(data.node),
            gender: tGender(data.node?.ownerGender),
            group: data.friendGroup.title
        });
    }
}

export function buildFriendDeletedSummary(data: StorySummaryData, t: TFunction): string {
    if (data.friendGroup?.title == null || data.friendGroup.title === "t:friends") {
        return t("instant-summary.story.friend-deleted-from-friends", {
            node: formatNodeName(data.node),
            gender: tGender(data.node?.ownerGender)
        });
    } else {
        return t("instant-summary.story.friend-deleted", {
            node: formatNodeName(data.node),
            gender: tGender(data.node?.ownerGender),
            group: data.friendGroup.title
        });
    }
}

export function buildFriendGroupDeletedSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.friend-group-deleted", {
        node: formatNodeName(data.node),
        gender: tGender(data.node?.ownerGender),
        group: data.friendGroup?.title ?? ""
    });
}

export function buildAskedToSubscribeSummary(data: StorySummaryData, t: TFunction): string {
    let summary = t("instant-summary.story.asked-to-subscribe", {
        node: formatNodeName(data.node),
        gender: tGender(data.node?.ownerGender),
        message: data.description ?? ""
    });
    if (data.description) {
        summary += `: ${data.description}`;
    }
    return summary;
}

export function buildAskedToFriendSummary(data: StorySummaryData, t: TFunction): string {
    let summary: string;
    if (data.friendGroup?.title == null || data.friendGroup.title === "t:friends") {
        summary = t("instant-summary.story.asked-to-friend", {
            node: formatNodeName(data.node),
            gender: tGender(data.node?.ownerGender),
            message: data.description ?? ""
        });
    } else {
        summary = t("instant-summary.story.asked-to-friend-group", {
            node: formatNodeName(data.node),
            gender: tGender(data.node?.ownerGender),
            group: data.friendGroup.title,
            message: data.description ?? ""
        });
    }
    if (data.description) {
        summary += `: ${data.description}`;
    }
    return summary;
}

export function buildBlockedUserSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.blocked-user", {
        node: formatNodeName(data.node),
        gender: tGender(data.node?.ownerGender),
        operations: formatBlockedOperations(data, t),
        period: formatBlockedPeriod(data, t)
    });
}

export function buildUnblockedUserSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.unblocked-user", {
        node: formatNodeName(data.node),
        gender: tGender(data.node?.ownerGender),
        operations: formatBlockedOperations(data, t)
    });
}

export function buildBlockedUserInPostingSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.blocked-user-in-posting", {
        node: formatNodeName(data.node),
        gender: tGender(data.node?.ownerGender),
        operations: formatBlockedOperations(data, t),
        heading: formatHeading(data.posting),
        period: formatBlockedPeriod(data, t)
    });
}

export function buildUnblockedUserInPostingSummary(data: StorySummaryData, t: TFunction): string {
    return t("instant-summary.story.unblocked-user-in-posting", {
        node: formatNodeName(data.node),
        gender: tGender(data.node?.ownerGender),
        operations: formatBlockedOperations(data, t),
        heading: formatHeading(data.posting)
    });
}

export function buildSheriffMarkedSummary(data: StorySummaryData, homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.sheriff-marked", {
        target: formatSheriffTarget(data, homeOwnerName, t)
    });
}

export function buildSheriffUnmarkedSummary(data: StorySummaryData, homeOwnerName: string | null, t: TFunction): string {
    return t("instant-summary.story.sheriff-unmarked", {
        target: formatSheriffTarget(data, homeOwnerName, t)
    });
}

export function buildSheriffComplainAddedSummary(t: TFunction): string {
    return t("instant-summary.story.sheriff-complain-added");
}

export function buildSheriffComplainDecidedSummary(data: StorySummaryData, homeOwnerName: string | null,
                                                   t: TFunction): string {
    return t("instant-summary.story.sheriff-complain-decided", {
        target: formatSheriffTarget(data, homeOwnerName, t)
    });
}

import { call, put, select } from 'typed-redux-saga/macro';

import { Node } from "api";
import { DraftText, PostingInfo, PrincipalValue } from "api/node/api-types";
import { errorThrown } from "state/error/actions";
import { POSTING_REPLY, postingReplyFailed } from "state/postingreply/actions";
import { getPosting } from "state/postings/selectors";
import { getSetting } from "state/settings/selectors";
import { getNodeUri } from "state/naming/sagas";
import { goToLocation, initFromLocation } from "state/navigation/actions";
import { isStandaloneMode } from "state/navigation/selectors";
import { getHomeOwnerName, getHomeRootLocation, getHomeRootPage } from "state/home/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { executor } from "state/executor";
import { urlWithParameters } from "util/url";
import { getWindowSelectionHtml, mentionName } from "util/misc";
import { quoteHtml } from "util/html";

export default [
    executor(POSTING_REPLY, "", postingReplySaga)
];

function* postingReplySaga() {
    const {standalone, posting, nodeRootPage, homeOwnerName, homeRootPage, homeRootLocation, subjectPrefix,
           preambleTemplate, quoteAll, visibilityDefault, commentsVisibilityDefault, commentAdditionDefault,
           reactionsPositiveDefault, reactionsNegativeDefault, reactionsVisibleDefault, reactionTotalsVisibleDefault} =
        yield* select(state => ({
            standalone: isStandaloneMode(state),
            posting: getPosting(state, state.postingReply.postingId),
            nodeRootPage: getNodeRootPage(state),
            homeOwnerName: getHomeOwnerName(state),
            homeRootPage: getHomeRootPage(state),
            homeRootLocation: getHomeRootLocation(state),
            subjectPrefix: getSetting(state, "posting.reply.subject-prefix") as string,
            preambleTemplate: getSetting(state, "posting.reply.preamble") as string,
            quoteAll: getSetting(state, "posting.reply.quote-all") as boolean,
            visibilityDefault: getSetting(state, "posting.visibility.default") as PrincipalValue,
            commentsVisibilityDefault: getSetting(state, "posting.comments.visibility.default") as PrincipalValue,
            commentAdditionDefault: getSetting(state, "posting.comments.addition.default") as PrincipalValue,
            reactionsPositiveDefault: getSetting(state, "posting.reactions.positive.default") as string,
            reactionsNegativeDefault: getSetting(state, "posting.reactions.negative.default") as string,
            reactionsVisibleDefault: getSetting(state, "posting.reactions.visible.default") as boolean,
            reactionTotalsVisibleDefault: getSetting(state, "posting.reactions.totals-visible.default") as boolean
        }));
    if (posting == null || homeOwnerName == null || nodeRootPage == null) {
        return;
    }
    try {
        const subject = replySubject(posting.body.subject, subjectPrefix);
        const preamble = preambleTemplate
            .replace("%POST%", yield* call(postingHref, posting, nodeRootPage))
            .replace("%USER%", mentionName(posting.ownerName, posting.ownerFullName));
        let text = getWindowSelectionHtml();
        if (text) {
            text = quoteHtml(text);
        } else if (quoteAll) {
            text = quoteHtml(posting.body.text?.trim());
        }
        const draftText: DraftText = {
            draftType: "new-posting",
            receiverName: homeOwnerName,
            bodySrc: JSON.stringify({
                subject,
                text: text ? `${preamble}\n>>>\n${text}\n>>>\n` : `${preamble}\n`
            }),
            bodySrcFormat: "markdown",
            acceptedReactions: {
                positive: reactionsPositiveDefault,
                negative: reactionsNegativeDefault
            },
            operations: {
                view: visibilityDefault,
                viewComments: commentsVisibilityDefault,
                addComment: commentAdditionDefault,
                viewReactions: reactionsVisibleDefault ? "public" : "private",
                viewNegativeReactions: reactionsVisibleDefault ? "public" : "private",
                viewReactionTotals: reactionTotalsVisibleDefault ? "public" : "private",
                viewNegativeReactionTotals: reactionTotalsVisibleDefault ? "public" : "private",
                viewReactionRatios: "public",
                viewNegativeReactionRatios: "public",
                addReaction: "public",
                addNegativeReaction: "public"
            }
        };
        const data = yield* call(Node.postDraft, ":", draftText);
        if (nodeRootPage !== homeRootPage) {
            if (!standalone || homeRootLocation == null) {
                window.location.href = urlWithParameters(homeRootPage + "/compose", {"draft": data.id});
            } else {
                yield* put(initFromLocation(homeRootLocation, "/compose", `?draft=${data.id}`, null))
            }
        } else {
            yield* put(goToLocation("/compose", `?draft=${data.id}`, null))
        }
    } catch (e) {
        yield* put(postingReplyFailed());
        yield* put(errorThrown(e));
    }
}

function replySubject(subject?: string | null, subjectPrefix?: string | null) {
    if (!subject || !subjectPrefix) {
        return subject;
    }
    if (!subject.startsWith(subjectPrefix)) {
        return subjectPrefix + " " + subject;
    }
    const tail = subject.substring(subjectPrefix.length);
    const m = tail.match(/^\s*\[(\d+)]\s+(.*)$/);
    if (m == null) {
        return subjectPrefix + "[2]" + tail;
    }
    return subjectPrefix + "[" + (parseInt(m[1]) + 1) + "] " + m[2];
}

function* postingHref(posting: PostingInfo, rootNodePage: string) {
    if (posting.receiverName == null) {
        return `${rootNodePage}/post/${posting.id}`;
    } else {
        const rootReceiverPage = yield* call(getNodeUri, posting.receiverName);
        return `${rootReceiverPage}/post/${posting.receiverPostingId}`;
    }
}

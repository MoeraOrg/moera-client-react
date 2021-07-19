import { call, put, select } from 'typed-redux-saga/macro';

import { Node } from "api";
import { DraftText, PostingInfo } from "api/node/api-types";
import { errorThrown } from "state/error/actions";
import { POSTING_REPLY, postingReplyFailed } from "state/postingreply/actions";
import { getPosting } from "state/postings/selectors";
import { getSetting } from "state/settings/selectors";
import { getNodeUri } from "state/naming/sagas";
import { goToLocation } from "state/navigation/actions";
import { urlWithParameters } from "util/url";
import { getWindowSelectionHtml, mentionName } from "util/misc";
import { quoteHtml } from "util/html";
import { getHomeOwnerName, getHomeRootPage } from "state/home/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { executor } from "state/executor";

export default [
    executor(POSTING_REPLY, "", postingReplySaga)
];

function* postingReplySaga() {
    const {posting, rootNodePage, homeOwnerName, rootHomePage, subjectPrefix, preambleTemplate, quoteAll,
           reactionsPositiveDefault, reactionsNegativeDefault, reactionsVisibleDefault, reactionTotalsVisibleDefault} =
        yield* select(state => ({
            posting: getPosting(state, state.postingReply.postingId),
            rootNodePage: getNodeRootPage(state),
            homeOwnerName: getHomeOwnerName(state),
            rootHomePage: getHomeRootPage(state),
            subjectPrefix: getSetting(state, "posting.reply.subject-prefix") as string,
            preambleTemplate: getSetting(state, "posting.reply.preamble") as string,
            quoteAll: getSetting(state, "posting.reply.quote-all") as boolean,
            reactionsPositiveDefault: getSetting(state, "posting.reactions.positive.default") as string,
            reactionsNegativeDefault: getSetting(state, "posting.reactions.negative.default") as string,
            reactionsVisibleDefault: getSetting(state, "posting.reactions.visible.default") as boolean,
            reactionTotalsVisibleDefault: getSetting(state, "posting.reactions.totals-visible.default") as boolean
        }));
    if (posting == null || homeOwnerName == null || rootNodePage == null) {
        return;
    }
    try {
        const subject = replySubject(posting.body.subject, subjectPrefix);
        const preamble = preambleTemplate
            .replace("%POST%", yield* call(postingHref, posting, rootNodePage))
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
            reactionsVisible: reactionsVisibleDefault,
            reactionTotalsVisible: reactionTotalsVisibleDefault
        };
        const data = yield* call(Node.postDraft, ":", draftText);
        if (rootNodePage !== rootHomePage) {
            window.location.href = urlWithParameters(rootHomePage + "/compose", {"draft": data.id});
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

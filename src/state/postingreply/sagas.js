import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import { errorThrown } from "state/error/actions";
import { POSTING_REPLY, postingReplyFailed } from "state/postingreply/actions";
import { getPosting } from "state/postings/selectors";
import { getSetting } from "state/settings/selectors";
import { getNodeUri } from "state/naming/sagas";
import { goToLocation } from "state/navigation/actions";
import { urlWithParameters } from "util/url";
import { getWindowSelectionHtml, mentionName } from "util/misc";
import { quoteHtml } from "util/html";
import { getHomeRootPage } from "state/home/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { executor } from "state/executor";

export default [
    executor(POSTING_REPLY, "", postingReplySaga)
];

function* postingReplySaga() {
    const {posting, rootNodePage, rootHomePage, subjectPrefix, preambleTemplate, quoteAll,
           reactionsPositiveDefault, reactionsNegativeDefault, reactionsVisibleDefault, reactionTotalsVisibleDefault} =
        yield select(state => ({
            posting: getPosting(state, state.postingReply.postingId),
            rootNodePage: getNodeRootPage(state),
            rootHomePage: getHomeRootPage(state),
            subjectPrefix: getSetting(state, "posting.reply.subject-prefix"),
            preambleTemplate: getSetting(state, "posting.reply.preamble"),
            quoteAll: getSetting(state, "posting.reply.quote-all"),
            reactionsPositiveDefault: getSetting(state, "posting.reactions.positive.default"),
            reactionsNegativeDefault: getSetting(state, "posting.reactions.negative.default"),
            reactionsVisibleDefault: getSetting(state, "posting.reactions.visible.default"),
            reactionTotalsVisibleDefault: getSetting(state, "posting.reactions.totals-visible.default")
        }));
    try {
        const subject = replySubject(posting.body.subject, subjectPrefix);
        const preamble = preambleTemplate
            .replace("%POST%", yield call(postingHref, posting, rootNodePage))
            .replace("%USER%", mentionName(posting.ownerName, posting.ownerFullName));
        let text = getWindowSelectionHtml();
        if (text) {
            text = quoteHtml(text);
        } else if (quoteAll) {
            text = quoteHtml(posting.body.text.trim());
        }
        const postingText = {
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
        const data = yield call(Node.postDraft, ":", postingText);
        if (rootNodePage !== rootHomePage) {
            window.location = urlWithParameters(rootHomePage + "/compose", {"draft": data.id});
        } else {
            yield put(goToLocation("/compose", `?draft=${data.id}`, null))
        }
    } catch (e) {
        yield put(postingReplyFailed());
        yield put(errorThrown(e));
    }
}

function replySubject(subject, subjectPrefix) {
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

function* postingHref(posting, rootNodePage) {
    if (posting.receiverName == null) {
        return `${rootNodePage}/post/${posting.id}`;
    } else {
        const rootReceiverPage = yield call(getNodeUri, posting.receiverName);
        return `${rootReceiverPage}/post/${posting.receiverPostingId}`;
    }
}

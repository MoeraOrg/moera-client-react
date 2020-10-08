import { call, put, select } from 'redux-saga/effects';

import { Node, NodeName } from "api";
import { errorThrown } from "state/error/actions";
import { postingReplyFailed } from "state/postingreply/actions";
import { getPosting } from "state/postings/selectors";
import { getWindowSelectionHtml, urlWithParameters } from "util/misc";
import { getSetting } from "state/settings/selectors";
import { getNodeUri } from "state/naming/sagas";
import { goToLocation } from "state/navigation/actions";

export function* postingReplySaga() {
    const {posting, rootNodePage, rootHomePage, subjectPrefix, preambleTemplate, quoteAll,
           reactionsPositiveDefault, reactionsNegativeDefault, reactionsVisibleDefault, reactionTotalsVisibleDefault} =
        yield select(state => ({
            posting: getPosting(state, state.postingReply.postingId),
            rootNodePage: state.node.root.page,
            rootHomePage: state.home.root.page,
            subjectPrefix: getSetting(state, "posting.reply.subject-prefix"),
            preambleTemplate: getSetting(state, "posting.reply.preamble"),
            quoteAll: getSetting(state, "posting.reply.quote-all"),
            reactionsPositiveDefault: getSetting(state, "posting.reactions.positive.default"),
            reactionsNegativeDefault: getSetting(state, "posting.reactions.negative.default"),
            reactionsVisibleDefault: getSetting(state, "posting.reactions.visible.default"),
            reactionTotalsVisibleDefault: getSetting(state, "posting.reactions.totals-visible.default")
        }));
    try {
        const name = NodeName.parse(posting.ownerName).name;
        const subject = replySubject(posting.body.subject, subjectPrefix);
        const preamble = preambleTemplate
            .replace("%POST%", yield call(postingHref, posting, rootNodePage))
            .replace("%USER%", name);
        let text = getWindowSelectionHtml();
        if (!text && quoteAll) {
            text = posting.body.text;
        }
        if (text) {
            text = text
                .replace(/\n*<p>\n*/gi, "\n\n")
                .replace(/<blockquote>\n+/gi, "<blockquote>\n")
                .replace(/<\/p>/gi, "")
                .replace(/\n*<br\s*\/?>\n*/gi, "\n")
                .replace(/<a[^>]*data-nodename[^>]*>(@[^<]+)<\/a>/gi, "$1")
                .replace(/<img\s+src="https:\/\/twemoji\.[^"]*\/([0-9a-f]+).svg"[^>]*>/gi,
                         (g0, g1) => String.fromCodePoint(parseInt(g1, 16)))
        }
        const postingText = {
            bodySrc: JSON.stringify({
                subject,
                text: text ? `${preamble}\n>>>\n${text.trim()}\n>>>\n` : `${preamble}\n`
            }),
            bodySrcFormat: "markdown",
            acceptedReactions: {
                positive: reactionsPositiveDefault,
                negative: reactionsNegativeDefault
            },
            reactionsVisible: reactionsVisibleDefault,
            reactionTotalsVisible: reactionTotalsVisibleDefault
        };
        const data = yield call(Node.postDraftPosting, ":", postingText);
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

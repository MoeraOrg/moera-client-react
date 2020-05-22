import { call, put, select } from 'redux-saga/effects';

import { Node, NodeName } from "api";
import { errorThrown } from "state/error/actions";
import { postingReplyFailed } from "state/postingreply/actions";
import { getOwnerName } from "state/owner/selectors";
import { getPosting } from "state/postings/selectors";
import { getWindowSelectionHtml, urlWithParameters } from "util/misc";
import { getSetting } from "state/settings/selectors";

export function* postingReplySaga() {
    const {posting, rootNodePage, ownerName, rootHomePage, subjectPrefix, preambleTemplate, quoteAll,
           reactionsPositiveDefault, reactionsNegativeDefault, reactionsVisibleDefault, reactionTotalsVisibleDefault} =
        yield select(state => ({
            posting: getPosting(state, state.postingReply.postingId),
            rootNodePage: state.node.root.page,
            ownerName: getOwnerName(state),
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
        const name = NodeName.parse(ownerName).name;
        const subject = posting.body.subject && subjectPrefix
            ? subjectPrefix + " " + posting.body.subject : posting.body.subject;
        const preamble = preambleTemplate
            .replace("%POST%", `${rootNodePage}/post/${posting.id}`)
            .replace("%USER%", name);
        let text = getWindowSelectionHtml();
        if (!text && quoteAll) {
            text = posting.body.text;
        }
        if (text) {
            text = text
                .replace(/\n*<p>\n*/gi, "\n\n")
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
        window.location = urlWithParameters(rootHomePage + "/compose", {"draft": data.id});
    } catch (e) {
        yield put(postingReplyFailed());
        yield put(errorThrown(e));
    }
}

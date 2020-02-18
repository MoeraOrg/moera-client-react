import { call, put, select } from 'redux-saga/effects';

import { Home, NodeName } from "api";
import { errorThrown } from "state/error/actions";
import { postingReplyFailed } from "state/postingreply/actions";
import { getOwnerName } from "state/owner/selectors";
import { getPosting } from "state/postings/selectors";
import { getWindowSelectionHtml, urlWithParameters } from "util/misc";

export function* postingReplySaga() {
    const {posting, rootNodePage, ownerName, rootHomePage} = yield select(state => ({
        posting: getPosting(state, state.postingReply.postingId),
        rootNodePage: state.node.root.page,
        ownerName: getOwnerName(state),
        rootHomePage: state.home.root.page
    }));
    try {
        const name = NodeName.parse(ownerName).name;
        let text = getWindowSelectionHtml();
        if (!text) {
            text = posting.body.text;
        }
        const postingText = {
            bodySrc: JSON.stringify({
                subject: posting.body.subject ? "Re: " + posting.body.subject : "",
                text: `Reply to [the post](${rootNodePage}/post/${posting.id}) by @${name}:\n`
                    + `>>>\n${text.trim()}\n>>>\n`
            }),
            bodySrcFormat: "markdown"
        };
        const data = yield call(Home.postDraftPosting, postingText);
        window.location = urlWithParameters(rootHomePage + "/compose", {"draft": data.id});
    } catch (e) {
        yield put(postingReplyFailed());
        yield put(errorThrown(e));
    }
}

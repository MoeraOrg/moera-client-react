import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from "clipboard-copy";

import {
    getLightBoxCommentId,
    getLightBoxMediaId,
    getLightBoxMediaPostingId,
    getLightBoxNodeName,
    getLightBoxPostingId
} from "state/lightbox/selectors";
import { postingLoad } from "state/postings/actions";
import { flashBox } from "state/flashbox/actions";
import { errorThrown } from "state/error/actions";
import { executor } from "state/executor";
import {
    LIGHT_BOX_COPY_LINK,
    LIGHT_BOX_COPY_MEDIA_LINK,
    LIGHT_BOX_MEDIA_POSTING_LOAD,
    LightBoxCopyMediaLinkAction
} from "state/lightbox/actions";
import { ClientState } from "state/state";
import { postingGetLink } from "state/postings/sagas";
import { Browser } from "ui/browser";
import { urlWithParameters } from "util/url";

export default [
    executor(LIGHT_BOX_MEDIA_POSTING_LOAD, null, lightBoxMediaPostingLoadSaga),
    executor(LIGHT_BOX_COPY_LINK, null, lightBoxCopyLinkSaga),
    executor(LIGHT_BOX_COPY_MEDIA_LINK, null, lightBoxCopyMediaLinkSaga)
];

function* lightBoxMediaPostingLoadSaga() {
    const {nodeName, postingId} = yield* select((state: ClientState) => ({
        nodeName: getLightBoxNodeName(state),
        postingId: getLightBoxMediaPostingId(state)
    }));
    if (postingId != null) {
        yield* put(postingLoad(postingId, nodeName));
    }
}

function* lightBoxCopyLinkSaga() {
    const {nodeName, postingId, commentId, mediaId} = yield* select((state: ClientState) => ({
        nodeName: getLightBoxNodeName(state),
        postingId: getLightBoxPostingId(state),
        commentId: getLightBoxCommentId(state),
        mediaId: getLightBoxMediaId(state)
    }));
    if (postingId == null) {
        return;
    }
    try {
        let href = yield* call(postingGetLink, postingId, nodeName);
        href = urlWithParameters(href, {"comment": commentId, "media": mediaId});
        yield* call(clipboardCopy, href);
        if (Browser.userAgentOs !== "android" || window.Android) {
            yield* put(flashBox("Link copied to the clipboard"));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* lightBoxCopyMediaLinkSaga(action: LightBoxCopyMediaLinkAction) {
    try {
        yield* call(clipboardCopy, action.payload.url);
        if (Browser.userAgentOs !== "android" || window.Android) {
            yield* put(flashBox("Link copied to the clipboard"));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

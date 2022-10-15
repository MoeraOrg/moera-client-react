import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';

import { ClientState } from "state/state";
import { executor } from "state/executor";
import { getNodeUri } from "state/naming/sagas";
import { postingLoad } from "state/postings/actions";
import { flashBox } from "state/flashbox/actions";
import { errorThrown } from "state/error/actions";
import {
    LIGHT_BOX_COPY_LINK,
    LIGHT_BOX_COPY_MEDIA_LINK,
    LIGHT_BOX_MEDIA_POSTING_LOAD,
    LightBoxCopyLinkAction,
    LightBoxCopyMediaLinkAction
} from "state/lightbox/actions";
import { getLightBoxMediaPostingId, getLightBoxNodeName } from "state/lightbox/selectors";
import { Browser } from "ui/browser";

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

function* lightBoxCopyLinkSaga(action: LightBoxCopyLinkAction) {
    const {nodeName, url} = action.payload;
    try {
        const nodeUri = yield* call(getNodeUri, nodeName);
        yield* call(clipboardCopy, nodeUri + url);
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

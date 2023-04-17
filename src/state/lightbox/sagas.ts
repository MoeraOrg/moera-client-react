import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

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
    LIGHT_BOX_MEDIA_SET,
    LightBoxCopyLinkAction,
    LightBoxCopyMediaLinkAction,
    LightBoxMediaSetAction
} from "state/lightbox/actions";
import { getLightBoxMediaPostingId, getLightBoxNodeName } from "state/lightbox/selectors";
import { Browser } from "ui/browser";

export default [
    executor(LIGHT_BOX_MEDIA_POSTING_LOAD, null, lightBoxMediaPostingLoadSaga),
    executor(LIGHT_BOX_MEDIA_SET, null, lightBoxMediaSetSaga),
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

function* lightBoxMediaSetSaga(action: LightBoxMediaSetAction) {
    switch (action.payload.sequence) {
        case "next-loop":
            yield* put(flashBox(i18n.t("returned-to-beginning"), true));
            break;
        case "prev-loop":
            yield* put(flashBox(i18n.t("returned-to-end"), true));
            break;
    }
}

function* lightBoxCopyLinkSaga(action: LightBoxCopyLinkAction) {
    const {nodeName, url} = action.payload;
    try {
        const nodeUri = yield* call(getNodeUri, nodeName);
        yield* call(clipboardCopy, nodeUri + url);
        if (!Browser.isAndroidBrowser()) {
            yield* put(flashBox(i18n.t("link-copied")));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

function* lightBoxCopyMediaLinkSaga(action: LightBoxCopyMediaLinkAction) {
    try {
        yield* call(clipboardCopy, action.payload.url);
        if (!Browser.isAndroidBrowser()) {
            yield* put(flashBox(i18n.t("link-copied")));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

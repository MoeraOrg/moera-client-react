import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import { ClientState } from "state/state";
import { executor } from "state/executor";
import { getNodeUri } from "state/naming/sagas";
import { postingLoad } from "state/postings/actions";
import { flashBox } from "state/flashbox/actions";
import { errorThrown } from "state/error/actions";
import { LightBoxCopyLinkAction, LightBoxMediaPostingLoadAction, LightBoxMediaSetAction } from "state/lightbox/actions";
import { getLightBoxMediaPostingId, getLightBoxNodeName } from "state/lightbox/selectors";
import * as Browser from "ui/browser";

export default [
    executor("LIGHT_BOX_MEDIA_POSTING_LOAD", null, lightBoxMediaPostingLoadSaga),
    executor("LIGHT_BOX_MEDIA_SET", null, lightBoxMediaSetSaga),
    executor("LIGHT_BOX_COPY_LINK", null, lightBoxCopyLinkSaga)
];

function* lightBoxMediaPostingLoadSaga(action: LightBoxMediaPostingLoadAction) {
    const {nodeName, postingId} = yield* select((state: ClientState) => ({
        nodeName: getLightBoxNodeName(state),
        postingId: getLightBoxMediaPostingId(state)
    }));
    if (postingId != null) {
        yield* put(postingLoad(postingId, nodeName).causedBy(action));
    }
}

function* lightBoxMediaSetSaga(action: LightBoxMediaSetAction) {
    switch (action.payload.sequence) {
        case "next-loop":
            yield* put(flashBox(i18n.t("returned-to-beginning"), true).causedBy(action));
            break;
        case "prev-loop":
            yield* put(flashBox(i18n.t("returned-to-end"), true).causedBy(action));
            break;
    }
}

function* lightBoxCopyLinkSaga(action: LightBoxCopyLinkAction) {
    const {nodeName, url} = action.payload;
    try {
        const nodeUri = yield* call(getNodeUri, action, nodeName);
        yield* call(clipboardCopy, Browser.universalLocation(null, nodeName, nodeUri, url));
        if (!Browser.isAndroidBrowser()) {
            yield* put(flashBox(i18n.t("link-copied")).causedBy(action));
        }
    } catch (e) {
        yield* put(errorThrown(e));
    }
}

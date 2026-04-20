import i18n from 'i18next';

import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { saga } from "state/saga";
import { getNodeUri } from "state/naming/sagas";
import { postingLoad } from "state/postings/actions";
import { flashBox } from "state/flashbox/actions";
import { errorThrown } from "state/error/actions";
import { LightboxCopyLinkAction, LightboxMediaPostingLoadAction, LightboxMediaSetAction } from "state/lightbox/actions";
import { getLightboxMediaPostingId, getLightboxNodeName } from "state/lightbox/selectors";
import * as Browser from "ui/browser";
import { absoluteNodeName } from "util/rel-node-name";
import { universalLocation } from "util/universal-url";
import { clipboardCopy } from "util/clipboard";

export default [
    saga("LIGHTBOX_MEDIA_POSTING_LOAD", null, lightboxMediaPostingLoadSaga),
    saga("LIGHTBOX_MEDIA_SET", null, lightboxMediaSetSaga),
    saga("LIGHTBOX_COPY_LINK", null, lightboxCopyLinkSaga)
];

function lightboxMediaPostingLoadSaga(action: LightboxMediaPostingLoadAction): void {
    const {nodeName, postingId} = select(state => ({
        nodeName: getLightboxNodeName(state),
        postingId: getLightboxMediaPostingId(state)
    }));
    if (postingId != null) {
        dispatch(postingLoad(postingId, nodeName).causedBy(action));
    }
}

function lightboxMediaSetSaga(action: LightboxMediaSetAction): void {
    switch (action.payload.sequence) {
        case "next-loop":
            dispatch(flashBox(i18n.t("returned-to-beginning"), true).causedBy(action));
            break;
        case "prev-loop":
            dispatch(flashBox(i18n.t("returned-to-end"), true).causedBy(action));
            break;
    }
}

async function lightboxCopyLinkSaga(action: WithContext<LightboxCopyLinkAction>): Promise<void> {
    let {nodeName, url} = action.payload;
    nodeName = absoluteNodeName(nodeName, action.context);
    try {
        const nodeUri = await getNodeUri(action, nodeName);
        await clipboardCopy(universalLocation(null, nodeName, nodeUri, url));
        if (!Browser.isAndroidBrowser()) {
            dispatch(flashBox(i18n.t("link-copied")).causedBy(action));
        }
    } catch (e) {
        dispatch(errorThrown(e));
    }
}

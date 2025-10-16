import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import { WithContext } from "state/action-types";
import { dispatch, select } from "state/store-sagas";
import { executor } from "state/executor";
import { getNodeUri } from "state/naming/sagas";
import { postingLoad } from "state/postings/actions";
import { flashBox } from "state/flashbox/actions";
import { errorThrown } from "state/error/actions";
import { LightBoxCopyLinkAction, LightBoxMediaPostingLoadAction, LightBoxMediaSetAction } from "state/lightbox/actions";
import { getLightBoxMediaPostingId, getLightBoxNodeName } from "state/lightbox/selectors";
import * as Browser from "ui/browser";
import { absoluteNodeName } from "util/rel-node-name";
import { universalLocation } from "util/universal-url";

export default [
    executor("LIGHT_BOX_MEDIA_POSTING_LOAD", null, lightBoxMediaPostingLoadSaga),
    executor("LIGHT_BOX_MEDIA_SET", null, lightBoxMediaSetSaga),
    executor("LIGHT_BOX_COPY_LINK", null, lightBoxCopyLinkSaga)
];

function lightBoxMediaPostingLoadSaga(action: LightBoxMediaPostingLoadAction): void {
    const {nodeName, postingId} = select(state => ({
        nodeName: getLightBoxNodeName(state),
        postingId: getLightBoxMediaPostingId(state)
    }));
    if (postingId != null) {
        dispatch(postingLoad(postingId, nodeName).causedBy(action));
    }
}

function lightBoxMediaSetSaga(action: LightBoxMediaSetAction): void {
    switch (action.payload.sequence) {
        case "next-loop":
            dispatch(flashBox(i18n.t("returned-to-beginning"), true).causedBy(action));
            break;
        case "prev-loop":
            dispatch(flashBox(i18n.t("returned-to-end"), true).causedBy(action));
            break;
    }
}

async function lightBoxCopyLinkSaga(action: WithContext<LightBoxCopyLinkAction>): Promise<void> {
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

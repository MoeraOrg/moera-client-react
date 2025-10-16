import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import {
    closeShareDialog,
    openShareDialog,
    ShareDialogCopyLinkAction,
    ShareDialogPrepareAction,
    SharePageCopyLinkAction
} from "state/sharedialog/actions";
import { WithContext } from "state/action-types";
import { dispatch } from "state/store-sagas";
import { executor } from "state/executor";
import { getNodeUri } from "state/naming/sagas";
import { messageBox } from "state/messagebox/actions";
import { flashBox } from "state/flashbox/actions";
import * as Browser from "ui/browser";
import { htmlToMarkdown } from "ui/control/richtexteditor/markdown/markdown-html";
import { getWindowSelectionHtml, hasWindowSelection } from "util/ui";
import { absoluteNodeName } from "util/rel-node-name";
import { universalLocation } from "util/universal-url";

export default [
    executor("SHARE_DIALOG_PREPARE", "", shareDialogPrepareSaga),
    executor("SHARE_DIALOG_COPY_LINK", payload => payload.url, shareDialogCopyLinkSaga),
    executor("SHARE_PAGE_COPY_LINK", null, sharePageCopyLinkSaga)
];

function share(action: ShareDialogPrepareAction, url: string, text: string): void {
    if (window.Android) {
        window.Android.share(url, text);
        return;
    }
    if (navigator.share) {
        const data = {title: text, url};
        if (!navigator.canShare || navigator.canShare(data)) {
            navigator.share(data);
            return;
        }
    }
    dispatch(openShareDialog(text, url).causedBy(action));
}

async function shareDialogPrepareSaga(action: WithContext<ShareDialogPrepareAction>): Promise<void> {
    let {nodeName, href} = action.payload;

    nodeName = absoluteNodeName(nodeName, action.context);
    const text = hasWindowSelection() ? (htmlToMarkdown(getWindowSelectionHtml()) ?? "") : "";

    const nodeUri = await getNodeUri(action, nodeName);
    if (nodeUri == null) {
        dispatch(messageBox(i18n.t("cannot-resolve-name") + " " + nodeName).causedBy(action));
        return;
    }
    const url = universalLocation(null, nodeName, nodeUri, href);
    share(action, url, text);
}

async function shareDialogCopyLinkSaga(action: ShareDialogCopyLinkAction): Promise<void> {
    dispatch(closeShareDialog().causedBy(action));
    await clipboardCopy(action.payload.url);
    if (!Browser.isAndroidBrowser()) {
        dispatch(flashBox(i18n.t("link-copied")).causedBy(action));
    }
}

async function sharePageCopyLinkSaga(action: WithContext<SharePageCopyLinkAction>): Promise<void> {
    let {nodeName, href} = action.payload;

    nodeName = absoluteNodeName(nodeName, action.context);
    const nodeUri = await getNodeUri(action, nodeName);
    if (nodeUri == null) {
        dispatch(messageBox(i18n.t("cannot-resolve-name") + " " + nodeName).causedBy(action));
        return;
    }
    await clipboardCopy(universalLocation(null, nodeName, nodeUri, href));
    if (!Browser.isAndroidBrowser()) {
        dispatch(flashBox(i18n.t("link-copied")).causedBy(action));
    }
}

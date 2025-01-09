import { call, put } from 'typed-redux-saga';
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
import { executor } from "state/executor";
import { getNodeUri } from "state/naming/sagas";
import { messageBox } from "state/messagebox/actions";
import { flashBox } from "state/flashbox/actions";
import * as Browser from "ui/browser";
import { htmlToMarkdown } from "ui/control/richtexteditor/markdown/markdown-html";
import { getWindowSelectionHtml, hasWindowSelection } from "util/ui";
import { absoluteNodeName } from "util/rel-node-name";

export default [
    executor("SHARE_DIALOG_PREPARE", "", shareDialogPrepareSaga),
    executor("SHARE_DIALOG_COPY_LINK", payload => payload.url, shareDialogCopyLinkSaga),
    executor("SHARE_PAGE_COPY_LINK", null, sharePageCopyLinkSaga)
];

function* share(action: ShareDialogPrepareAction, url: string, text: string) {
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
    yield* put(openShareDialog(text, url).causedBy(action));
}

function* shareDialogPrepareSaga(action: WithContext<ShareDialogPrepareAction>) {
    let {nodeName, href} = action.payload;

    nodeName = absoluteNodeName(nodeName, action.context);
    const text = hasWindowSelection() ? (htmlToMarkdown(getWindowSelectionHtml()) ?? "") : "";

    const nodeUri = yield* call(getNodeUri, action, nodeName);
    if (nodeUri == null) {
        yield* put(messageBox(i18n.t("cannot-resolve-name") + " " + nodeName).causedBy(action));
        return;
    }
    const url = Browser.universalLocation(null, nodeName, nodeUri, href);
    yield* call(share, action, url, text);
}

function* shareDialogCopyLinkSaga(action: ShareDialogCopyLinkAction) {
    yield* put(closeShareDialog().causedBy(action));
    yield* call(clipboardCopy, action.payload.url);
    if (!Browser.isAndroidBrowser()) {
        yield* put(flashBox(i18n.t("link-copied")).causedBy(action));
    }
}

function* sharePageCopyLinkSaga(action: WithContext<SharePageCopyLinkAction>) {
    let {nodeName, href} = action.payload;

    nodeName = absoluteNodeName(nodeName, action.context);
    const nodeUri = yield* call(getNodeUri, action, nodeName);
    if (nodeUri == null) {
        yield* put(messageBox(i18n.t("cannot-resolve-name") + " " + nodeName).causedBy(action));
        return;
    }
    yield* call(clipboardCopy, Browser.universalLocation(null, nodeName, nodeUri, href));
    if (!Browser.isAndroidBrowser()) {
        yield* put(flashBox(i18n.t("link-copied")).causedBy(action));
    }
}

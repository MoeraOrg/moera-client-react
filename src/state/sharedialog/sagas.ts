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
import { executor } from "state/executor";
import { getNodeUri } from "state/naming/sagas";
import { messageBox } from "state/messagebox/actions";
import { flashBox } from "state/flashbox/actions";
import * as Browser from "ui/browser";
import { normalizeUrl } from "util/url";
import { getWindowSelectionHtml, hasWindowSelection } from "util/ui";
import { quoteHtml } from "util/html";

export default [
    executor("SHARE_DIALOG_PREPARE", "", shareDialogPrepareSaga),
    executor("SHARE_DIALOG_COPY_LINK", payload => payload.url, shareDialogCopyLinkSaga),
    executor("SHARE_PAGE_COPY_LINK", null, sharePageCopyLink)
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

function* shareDialogPrepareSaga(action: ShareDialogPrepareAction) {
    const {nodeName, href} = action.payload;

    const text = hasWindowSelection() ? (quoteHtml(getWindowSelectionHtml()) ?? "") : "";

    const nodeUri = yield* call(getNodeUri, action, nodeName);
    if (nodeUri == null) {
        yield* put(messageBox(i18n.t("cannot-resolve-name") + " " + nodeName).causedBy(action));
        return;
    }
    const url = normalizeUrl(nodeUri) + href;
    yield* call(share, action, url, text);
}

function* shareDialogCopyLinkSaga(action: ShareDialogCopyLinkAction) {
    yield* put(closeShareDialog().causedBy(action));
    yield* call(clipboardCopy, action.payload.url);
    if (!Browser.isAndroidBrowser()) {
        yield* put(flashBox(i18n.t("link-copied")).causedBy(action));
    }
}

function* sharePageCopyLink(action: SharePageCopyLinkAction) {
    const {nodeName, href} = action.payload;

    const nodeUri = yield* call(getNodeUri, action, nodeName);
    if (nodeUri == null) {
        yield* put(messageBox(i18n.t("cannot-resolve-name") + " " + nodeName).causedBy(action));
        return;
    }
    yield* call(clipboardCopy, normalizeUrl(nodeUri) + href);
    if (!Browser.isAndroidBrowser()) {
        yield* put(flashBox(i18n.t("link-copied")).causedBy(action));
    }
}

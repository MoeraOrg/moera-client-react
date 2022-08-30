import { call, put } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';

import {
    closeShareDialog,
    openShareDialog,
    SHARE_DIALOG_COPY_LINK,
    SHARE_DIALOG_PREPARE,
    SHARE_PAGE_COPY_LINK,
    ShareDialogCopyLinkAction,
    ShareDialogPrepareAction,
    SharePageCopyLinkAction
} from "state/sharedialog/actions";
import { executor } from "state/executor";
import { getNodeUri } from "state/naming/sagas";
import { messageBox } from "state/messagebox/actions";
import { flashBox } from "state/flashbox/actions";
import { Browser } from "ui/browser";
import { normalizeUrl } from "util/url";
import { getWindowSelectionHtml, hasWindowSelection } from "util/misc";
import { quoteHtml } from "util/html";

export default [
    executor(SHARE_DIALOG_PREPARE, "", shareDialogPrepareSaga),
    executor(SHARE_DIALOG_COPY_LINK, payload => payload.url, shareDialogCopyLinkSaga),
    executor(SHARE_PAGE_COPY_LINK, null, sharePageCopyLink)
];

function* share(url: string, text: string) {
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
    yield* put(openShareDialog(text, url));
}

function* shareDialogPrepareSaga(action: ShareDialogPrepareAction) {
    const {nodeName, href} = action.payload;

    const text = hasWindowSelection() ? (quoteHtml(getWindowSelectionHtml()) ?? "") : "";

    const nodeUri = yield* call(getNodeUri, nodeName);
    if (nodeUri == null) {
        yield* put(messageBox(`Cannot resolve name: ${nodeName}`));
        return;
    }
    const url = normalizeUrl(nodeUri) + href;
    yield* call(share, url, text);
}

function* shareDialogCopyLinkSaga(action: ShareDialogCopyLinkAction) {
    yield* put(closeShareDialog());
    yield* call(clipboardCopy, action.payload.url);
    if (Browser.userAgentOs !== "android" || window.Android) {
        yield* put(flashBox("Link copied to the clipboard"));
    }
}

function* sharePageCopyLink(action: SharePageCopyLinkAction) {
    const {nodeName, href} = action.payload;

    const nodeUri = yield* call(getNodeUri, nodeName);
    if (nodeUri == null) {
        yield* put(messageBox(`Cannot resolve name: ${nodeName}`));
        return;
    }
    yield* call(clipboardCopy, normalizeUrl(nodeUri) + href);
    if (Browser.userAgentOs !== "android" || window.Android) {
        yield* put(flashBox("Link copied to the clipboard"));
    }
}

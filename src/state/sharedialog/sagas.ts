import { call, put } from 'typed-redux-saga/macro';
import clipboardCopy from 'clipboard-copy';

import {
    closeShareDialog,
    openShareDialog,
    SHARE_DIALOG_COPY_LINK,
    SHARE_DIALOG_PREPARE,
    ShareDialogCopyLinkAction,
    ShareDialogPrepareAction
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
];

function* shareDialogPrepareSaga(action: ShareDialogPrepareAction) {
    const {title, nodeName, href} = action.payload;

    const text = hasWindowSelection() ? (quoteHtml(getWindowSelectionHtml()) ?? title) : title;

    const nodeUri = yield* call(getNodeUri, nodeName);
    if (nodeUri == null) {
        yield* put(messageBox(`Cannot resolve name: ${nodeName}`));
        return;
    }
    const url = normalizeUrl(nodeUri) + href;
    if (window.Android) {
        window.Android.share(url, text);
    } else if (navigator.share) {
        navigator.share({title: text, url});
    } else {
        yield* put(openShareDialog(text, url));
    }
}

function* shareDialogCopyLinkSaga(action: ShareDialogCopyLinkAction) {
    yield* put(closeShareDialog());
    yield* call(clipboardCopy, action.payload.url);
    if (Browser.userAgentOs !== "android" || window.Android) {
        yield* put(flashBox("Link copied to the clipboard"));
    }
}

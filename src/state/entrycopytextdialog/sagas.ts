import { call, put } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';

import { executor } from "state/executor";
import { ENTRY_COPY_TEXT, EntryCopyTextAction, openEntryCopyTextDialog } from "state/entrycopytextdialog/actions";
import { flashBox } from "state/flashbox/actions";
import { Browser } from "ui/browser";
import { clearHtml, containsTags, htmlToEmoji, quoteHtml } from "util/html";

export default [
    executor(ENTRY_COPY_TEXT, null, entryCopyTextSaga)
];

function* entryCopyTextSaga(action: EntryCopyTextAction) {
    let {body: {text}, mode} = action.payload;

    if (!text) {
        return;
    }

    if (mode === "ask") {
        const clean = text.replace(/<\/?(p|br)(\s[^>]*)?>/gi, "");
        if (!containsTags(htmlToEmoji(clean))) {
            mode = "text";
        }
    }

    if (mode === "ask") {
        yield* put(openEntryCopyTextDialog(action.payload.body));
        return;
    }

    text = quoteHtml(text);
    if (mode === "text") {
        text = clearHtml(text);
    }
    yield* call(clipboardCopy, text);
    if (Browser.userAgentOs !== "android" || window.Android) {
        yield* put(flashBox("Text copied to the clipboard"));
    }
}

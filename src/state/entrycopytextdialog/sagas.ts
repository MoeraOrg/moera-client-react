import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';

import { MediaAttachment, PrivateMediaFileInfo } from "api/node/api-types";
import { executor } from "state/executor";
import { ENTRY_COPY_TEXT, EntryCopyTextAction, openEntryCopyTextDialog } from "state/entrycopytextdialog/actions";
import { flashBox } from "state/flashbox/actions";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { Browser } from "ui/browser";
import { clearHtml, containsTags, htmlEntities, htmlToEmoji, quoteHtml } from "util/html";
import { mediaImagePreview } from "util/media-images";

export default [
    executor(ENTRY_COPY_TEXT, null, entryCopyTextSaga)
];

function* entryCopyTextSaga(action: EntryCopyTextAction) {
    let {body: {text}, mode, nodeName, media} = action.payload;

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
        yield* put(openEntryCopyTextDialog(action.payload.body, nodeName, media));
        return;
    }

    text = quoteHtml(text);
    if (mode === "text") {
        text = clearHtml(text);
    } else {
        const rootPage = yield* select(state =>
            nodeName ? getNamingNameNodeUri(state, nodeName) : getNodeRootPage(state));
        if (rootPage != null) {
            text = replaceMediaUrls(text, rootPage, media);
        }
    }
    yield* call(clipboardCopy, text);
    if (Browser.userAgentOs !== "android" || window.Android) {
        yield* put(flashBox("Text copied to the clipboard"));
    }
}

function replaceMediaUrls(html: string, rootPage: string, media: MediaAttachment[] | null): string {
    const mediaMap: Map<string, PrivateMediaFileInfo> = new Map(
        (media ?? [])
            .map(ma => ma.media)
            .filter((mf): mf is PrivateMediaFileInfo => mf != null)
            .map(mf => [mf.hash, mf])
    );
    return html.replace(/(<img[^>]*src=")hash:([^"]*)("[^>]*>)/gi,
        (g0, g1, g2, g3) => g1 + mediaUrl(rootPage, mediaMap.get(g2)) + g3)

}

function mediaUrl(rootPage: string, mediaFile: PrivateMediaFileInfo | undefined): string {
    if (mediaFile == null) {
        return "";
    }
    const mediaLocation = rootPage + "/media/" + mediaFile.path;
    return htmlEntities(mediaImagePreview(mediaLocation, 900));
}

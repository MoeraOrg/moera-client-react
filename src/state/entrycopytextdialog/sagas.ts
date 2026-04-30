import i18n from 'i18next';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { saga } from "state/saga";
import { dispatch, select } from "state/store-sagas";
import { EntryCopyTextAction, openEntryCopyTextDialog } from "state/entrycopytextdialog/actions";
import { flashBox } from "state/flashbox/actions";
import { getNamingNameRoot } from "state/naming/selectors";
import * as Browser from "ui/browser";
import { htmlToMarkdown } from "ui/control/richtexteditor/markdown/markdown-html";
import { clipboardCopy } from "util/clipboard";
import { clearHtml, containsTags, htmlEntities } from "util/html";
import { mediaImagePreview } from "util/media-images";
import { notNull } from "util/misc";

export default [
    saga("ENTRY_COPY_TEXT", null, entryCopyTextSaga)
];

async function entryCopyTextSaga(action: EntryCopyTextAction): Promise<void> {
    let {body: {text: bodyText}, mode, nodeName, media} = action.payload;

    if (!bodyText) {
        return;
    }

    if (mode === "ask") {
        if (!containsTags(bodyText, "basic")) {
            mode = "text";
        }
    }

    if (mode === "ask") {
        dispatch(openEntryCopyTextDialog(action.payload.body, nodeName, media).causedBy(action));
        return;
    }

    let text = htmlToMarkdown(bodyText);
    let html = undefined;
    if (mode === "text") {
        text = clearHtml(text);
        html = text;
    } else {
        const rootPage = select(state => getNamingNameRoot(state, nodeName));
        if (rootPage != null) {
            text = replaceMediaUrls(text, rootPage, media);
            html = replaceMediaUrls(bodyText, rootPage, media);
        }
    }
    await clipboardCopy(text, html);
    if (!Browser.isAndroidBrowser()) {
        dispatch(flashBox(i18n.t("text-copied")).causedBy(action));
    }
}

function replaceMediaUrls(html: string, rootPage: string, media: MediaAttachment[] | null): string {
    const mediaMap: Map<string, PrivateMediaFileInfo> = new Map(
        (media ?? [])
            .map(ma => ma.media)
            .filter(notNull)
            .map(mf => [mf.hash, mf])
    );
    return html.replace(/(<img[^>]*src=")hash:([^"]*)("[^>]*>)/gi,
        (g0, g1, g2, g3) => g1 + mediaUrl(rootPage, mediaMap.get(g2)) + g3)

}

function mediaUrl(rootPage: string, mediaFile: PrivateMediaFileInfo | undefined): string {
    if (mediaFile == null) {
        return "";
    }
    if (mediaFile.directPath) {
        return htmlEntities(rootPage + "/media/" + mediaFile.directPath)
    } else {
        return htmlEntities(mediaImagePreview(rootPage + "/media/" + mediaFile.path, 900));
    }
}

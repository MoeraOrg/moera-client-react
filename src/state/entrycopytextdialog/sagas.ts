import i18n from 'i18next';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { executor } from "state/executor";
import { dispatch, select } from "state/store-sagas";
import { EntryCopyTextAction, openEntryCopyTextDialog } from "state/entrycopytextdialog/actions";
import { flashBox } from "state/flashbox/actions";
import { getNamingNameRoot } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import * as Browser from "ui/browser";
import { htmlToMarkdown } from "ui/control/richtexteditor/markdown/markdown-html";
import { clipboardCopy } from "util/clipboard";
import { clearHtml, containsTags, htmlEntities } from "util/html";
import { mediaImagePreview } from "util/media-images";
import { urlWithParameters } from "util/url";
import { notNull } from "util/misc";

export default [
    executor("ENTRY_COPY_TEXT", null, entryCopyTextSaga)
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
        const {rootPage, carte} = select(state => ({
            rootPage: getNamingNameRoot(state, nodeName),
            carte: getCurrentViewMediaCarte(state)
        }));
        if (rootPage != null) {
            text = replaceMediaUrls(text, rootPage, carte, media);
            html = replaceMediaUrls(bodyText, rootPage, carte, media);
        }
    }
    await clipboardCopy(text, html);
    if (!Browser.isAndroidBrowser()) {
        dispatch(flashBox(i18n.t("text-copied")).causedBy(action));
    }
}

function replaceMediaUrls(html: string, rootPage: string, carte: string | null,
                          media: MediaAttachment[] | null): string {
    const mediaMap: Map<string, PrivateMediaFileInfo> = new Map(
        (media ?? [])
            .map(ma => ma.media)
            .filter(notNull)
            .map(mf => [mf.hash, mf])
    );
    return html.replace(/(<img[^>]*src=")hash:([^"]*)("[^>]*>)/gi,
        (g0, g1, g2, g3) => g1 + mediaUrl(rootPage, carte, mediaMap.get(g2)) + g3)

}

function mediaUrl(rootPage: string, carte: string | null, mediaFile: PrivateMediaFileInfo | undefined): string {
    if (mediaFile == null) {
        return "";
    }
    if (mediaFile.directPath) {
        return htmlEntities(rootPage + "/media/" + mediaFile.directPath)
    } else {
        const auth = carte != null ? "carte:" + carte : null;
        const mediaLocation = urlWithParameters(rootPage + "/media/" + mediaFile.path, {auth});
        return htmlEntities(mediaImagePreview(mediaLocation, 900));
    }
}

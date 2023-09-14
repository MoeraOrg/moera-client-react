import { call, put, select } from 'typed-redux-saga';
import clipboardCopy from 'clipboard-copy';
import i18n from 'i18next';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { executor } from "state/executor";
import { ENTRY_COPY_TEXT, EntryCopyTextAction, openEntryCopyTextDialog } from "state/entrycopytextdialog/actions";
import { flashBox } from "state/flashbox/actions";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { Browser } from "ui/browser";
import { clearHtml, containsTags, htmlEntities, quoteHtml } from "util/html";
import { mediaImagePreview } from "util/media-images";
import { urlWithParameters } from "util/url";

export default [
    executor(ENTRY_COPY_TEXT, null, entryCopyTextSaga)
];

function* entryCopyTextSaga(action: EntryCopyTextAction) {
    let {body: {text}, mode, nodeName, media} = action.payload;

    if (!text) {
        return;
    }

    if (mode === "ask") {
        if (!containsTags(text, "basic")) {
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
        const {rootPage, carte} = yield* select(state => ({
            rootPage: nodeName ? getNamingNameNodeUri(state, nodeName) : getNodeRootPage(state),
            carte: getCurrentViewMediaCarte(state)
        }));
        if (rootPage != null) {
            text = replaceMediaUrls(text, rootPage, carte, media);
        }
    }
    yield* call(clipboardCopy, text);
    if (!Browser.isAndroidBrowser()) {
        yield* put(flashBox(i18n.t("text-copied")));
    }
}

function replaceMediaUrls(html: string, rootPage: string, carte: string | null,
                          media: MediaAttachment[] | null): string {
    const mediaMap: Map<string, PrivateMediaFileInfo> = new Map(
        (media ?? [])
            .map(ma => ma.media)
            .filter((mf): mf is PrivateMediaFileInfo => mf != null)
            .map(mf => [mf.hash, mf])
    );
    return html.replace(/(<img[^>]*src=")hash:([^"]*)("[^>]*>)/gi,
        (g0, g1, g2, g3) => g1 + mediaUrl(rootPage, carte, mediaMap.get(g2)) + g3)

}

function mediaUrl(rootPage: string, carte: string | null, mediaFile: PrivateMediaFileInfo | undefined): string {
    if (mediaFile == null) {
        return "";
    }
    const auth = carte != null ? "carte:" + carte : null;
    const mediaLocation = urlWithParameters(rootPage + "/media/" + mediaFile.path, {auth});
    return htmlEntities(mediaImagePreview(mediaLocation, 900));
}

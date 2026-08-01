import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MediaAttachment } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getRemoteMedia } from "state/remotemedia/selectors";
import { closeLightbox, LightboxMediaSequence, lightboxMediaSet } from "state/lightbox/actions";
import { getLightboxMediaId, getLightboxMediaPostingId } from "state/lightbox/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { ExtCommentInfo } from "state/detailedposting/state";
import { getComment } from "state/detailedposting/selectors";
import { getSetting } from "state/settings/selectors";
import { ParentContext, useDispatcher } from "ui/hook";
import EntryHtml from "ui/entry/EntryHtml";
import Lightbox from "ui/lightbox/Lightbox";
import { lightboxSource } from "ui/lightbox/lightbox-source";
import LightboxReactions from "ui/lightbox/LightboxReactions";
import LightboxCopyTextButton from "ui/lightbox/LightboxCopyTextButton";
import LightboxShareButton from "ui/lightbox/LightboxShareButton";
import LightboxDownloadButton from "ui/lightbox/LightboxDownloadButton";
import { useOverlay } from "ui/overlays/overlays";
import { mediaDownloadUrl, resolveMediaUrl } from "util/media-url";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";

export default function GalleryLightbox() {
    const posting = useSelector((state: ClientState) => getPosting(state, state.lightbox.postingId, REL_CURRENT));
    // comment === null means commentId === null
    // comment === undefined means the comment is not loaded yet
    const comment = useSelector((state: ClientState) =>
        state.lightbox.commentId != null ? getComment(state, state.lightbox.commentId) ?? undefined : null
    );
    const mediaId = useSelector(getLightboxMediaId);
    const mediaNodeName = useSelector((state: ClientState) => state.lightbox.nodeName);
    const autoPlay = useSelector((state: ClientState) => state.lightbox.autoPlay);
    const mediaPosting = useSelector((state: ClientState) =>
        getPosting(state, getLightboxMediaPostingId(state), mediaNodeName)
    );
    const loopGallery = useSelector((state: ClientState) => getSetting(state, "entry.gallery.loop") as boolean);
    const dispatch = useDispatcher();

    const onCloseRequest = useCallback(() => dispatch(closeLightbox()), [dispatch]);

    const [zIndex, overlayId] = useOverlay(null, {closeOnClick: false, onClose: onCloseRequest});

    const media = useMemo(() => getGallery(posting, comment), [comment, posting]);
    const loop = loopGallery && media != null && media.length > 1;

    let index = media?.findIndex(attachment =>
        attachment.media?.id === mediaId || attachment.remoteMedia?.mediaId === mediaId
    ) ?? 0;
    if (index < 0) {
        index = 0;
    }

    const {
        href: mainHref,
        src: mainSrc,
        downloadUrl: mainDownloadUrl,
        mimeType: mainMimeType,
        textContent: mainTextContent
    } = useLightboxMedia(mediaNodeName, media != null ? media[index] : undefined);

    const prevIndex = index > 0
        ? index - 1
        : (media != null && index === 0 && loop ? media.length - 1 : null);
    const prevSequence: LightboxMediaSequence = prevIndex != null && prevIndex > index ? "prev-loop" : "normal";

    const {
        src: prevSrc, mediaId: prevMediaId, mimeType: prevMimeType
    } = useLightboxMedia(mediaNodeName, media != null && prevIndex != null ? media[prevIndex] : undefined);

    const nextIndex = media != null && index < media.length - 1
        ? index + 1
        : (media != null && index === media.length - 1 && loop ? 0 : null);
    const nextSequence: LightboxMediaSequence = nextIndex != null && nextIndex < index ? "next-loop" : "normal";

    const {
        src: nextSrc, mediaId: nextMediaId, mimeType: nextMimeType
    } = useLightboxMedia(mediaNodeName, media != null && nextIndex != null ? media[nextIndex] : undefined);

    const statusText = media != null && media.length > 0 ? `${index + 1} / ${media.length}` : "";
    const mainSource = lightboxSource(mainSrc, mainMimeType) ?? {url: "", type: "image"};
    const prevSource = lightboxSource(prevSrc, prevMimeType);
    const nextSource = lightboxSource(nextSrc, nextMimeType);

    const onMovePrev = () => prevMediaId != null ? dispatch(lightboxMediaSet(prevMediaId, prevSequence)) : null;

    const onMoveNext = () => nextMediaId != null ? dispatch(lightboxMediaSet(nextMediaId, nextSequence)) : null;

    return (
        <ParentContext.Provider value={{hide: onCloseRequest, overlayId}}>
            <Lightbox
                mainSrc={mainSource}
                prevSrc={prevSource}
                nextSrc={nextSource}
                autoPlay={autoPlay}
                statusText={statusText}
                onMovePrev={onMovePrev}
                onMoveNext={onMoveNext}
                zIndex={zIndex?.shadow}
                toolbarButtons={[
                    mainTextContent && <LightboxCopyTextButton text={mainTextContent}/>,
                    <LightboxShareButton mediaNodeName={mediaNodeName} mediaHref={mainHref ?? ""}/>,
                    <LightboxDownloadButton mediaUrl={mainDownloadUrl ?? ""} mediaMimeType={mainMimeType}/>,
                ]}
                controls={[
                    <LightboxReactions/>,
                ]}
                caption={mediaPosting?.body.text &&
                    <EntryHtml postingId={mediaPosting.id} html={mediaPosting.body.text}/>
                }
            />
        </ParentContext.Provider>
    );
}

function getGallery(
    posting: ExtPostingInfo | null, comment: ExtCommentInfo | null | undefined
): MediaAttachment[] | null {
    // important: !== not !=
    const entry = comment !== null ? comment : posting;
    const media = (entry?.media ?? []).filter(mf => !mf.media?.attachment && !mf.remoteMedia?.attachment);
    if (media.length === 0) {
        return null;
    }
    const linkPreviews = entry?.body.linkPreviews ?? [];
    if (linkPreviews.length === 0) {
        return media;
    }
    const linkPreviewImages = new Set(linkPreviews.map(lp => lp.imageHash));
    return media.filter(mf => !linkPreviewImages.has(mf.media?.hash) && !linkPreviewImages.has(mf.remoteMedia?.hash));
}

interface LightboxMediaAttributes {
    mediaId: string | undefined;
    href: string | undefined;
    src: string | undefined;
    downloadUrl: string | undefined;
    mimeType: string;
    textContent: string | undefined;
}

function useLightboxMedia(
    nodeName: string | RelNodeName, media: MediaAttachment | null | undefined
): LightboxMediaAttributes {
    const mediaFile = media?.media;
    const remoteMedia = media?.remoteMedia;
    const remoteMediaFile = useSelector((state: ClientState) =>
        getRemoteMedia(state, remoteMedia?.nodeName, remoteMedia?.mediaId, remoteMedia?.digest)
    );
    const actualNodeName = (mediaFile != null ? nodeName : remoteMedia?.nodeName) ?? nodeName;
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, actualNodeName));
    const actualMediaFile = mediaFile ?? remoteMediaFile;

    if (actualMediaFile == null) {
        return {
            mediaId: undefined,
            href: undefined,
            src: undefined,
            downloadUrl: undefined,
            mimeType: "image/jpeg",
            textContent: undefined
        };
    }

    const mediaId = mediaFile?.id ?? remoteMedia?.mediaId;
    const href = "/media/" + actualMediaFile.path;
    const src = resolveMediaUrl(rootPage, actualMediaFile.directPath ?? actualMediaFile.path);
    const downloadUrl = mediaDownloadUrl(rootPage, actualMediaFile);
    const mimeType = actualMediaFile.mimeType;
    const textContent = actualMediaFile.textContent ?? undefined;

    return {mediaId, href, src, downloadUrl, mimeType, textContent};
}

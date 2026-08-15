import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MediaAttachment } from "api";
import { ClientState } from "state/state";
import { closeLightbox, LightboxMediaSequence, lightboxMediaSet } from "state/lightbox/actions";
import { getLightboxMediaId, getLightboxMediaPostingId } from "state/lightbox/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { ExtCommentInfo } from "state/detailedposting/state";
import { getComment } from "state/detailedposting/selectors";
import { getSetting } from "state/settings/selectors";
import { ParentContext, useDispatcher } from "ui/hook";
import { useActualMedia, useMediaPreviewAttributes } from "ui/entry/media";
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
        previewSrc: mainPreviewSrc,
        width: mainWidth,
        height: mainHeight,
        downloadUrl: mainDownloadUrl,
        mimeType: mainMimeType,
        textContent: mainTextContent
    } = useLightboxMedia(mediaNodeName, media != null ? media[index] : undefined);

    const prevIndex = index > 0
        ? index - 1
        : (media != null && index === 0 && loop ? media.length - 1 : null);
    const prevSequence: LightboxMediaSequence = prevIndex != null && prevIndex > index ? "prev-loop" : "normal";

    const {
        src: prevSrc, previewSrc: prevPreviewSrc, width: prevWidth, height: prevHeight,
        mediaId: prevMediaId, mimeType: prevMimeType
    } = useLightboxMedia(mediaNodeName, media != null && prevIndex != null ? media[prevIndex] : undefined);

    const nextIndex = media != null && index < media.length - 1
        ? index + 1
        : (media != null && index === media.length - 1 && loop ? 0 : null);
    const nextSequence: LightboxMediaSequence = nextIndex != null && nextIndex < index ? "next-loop" : "normal";

    const {
        src: nextSrc, previewSrc: nextPreviewSrc, width: nextWidth, height: nextHeight,
        mediaId: nextMediaId, mimeType: nextMimeType
    } = useLightboxMedia(mediaNodeName, media != null && nextIndex != null ? media[nextIndex] : undefined);

    const statusText = media != null && media.length > 0 ? `${index + 1} / ${media.length}` : "";
    const mainSource = lightboxSource(mainSrc, mainPreviewSrc, mainWidth, mainHeight, mainMimeType)
        ?? {url: "", previewUrl: undefined, width: undefined, height: undefined, type: "image"};
    const prevSource = lightboxSource(prevSrc, prevPreviewSrc, prevWidth, prevHeight, prevMimeType);
    const nextSource = lightboxSource(nextSrc, nextPreviewSrc, nextWidth, nextHeight, nextMimeType);

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
                    <LightboxReactions key="reactions"/>,
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
    previewSrc: string | undefined;
    width: number | undefined;
    height: number | undefined;
    downloadUrl: string | undefined;
    mimeType: string;
    textContent: string | undefined;
}

function useLightboxMedia(
    nodeName: string | RelNodeName, media: MediaAttachment | null | undefined
): LightboxMediaAttributes {
    const {
        mediaId, actualRootPage, actualMediaFile
    } = useActualMedia(nodeName, media?.media ?? null, media?.remoteMedia ?? null);
    const {src: previewSrc} = useMediaPreviewAttributes(nodeName, media?.media ?? null, media?.remoteMedia ?? null);

    if (actualMediaFile == null) {
        return {
            mediaId: undefined,
            href: undefined,
            src: undefined,
            previewSrc: undefined,
            width: undefined,
            height: undefined,
            downloadUrl: undefined,
            // try to avoid showing LightboxImage instead of LightboxVideo
            mimeType: media?.media?.mimeType ?? media?.remoteMedia?.mimeType ?? "image/jpeg",
            textContent: undefined
        };
    }

    const href = "/media/" + actualMediaFile.path;
    const src = resolveMediaUrl(actualRootPage, actualMediaFile.directPath ?? actualMediaFile.path);
    const downloadUrl = mediaDownloadUrl(actualRootPage, actualMediaFile);
    const mimeType = actualMediaFile.mimeType;
    const textContent = actualMediaFile.textContent ?? undefined;
    const width = actualMediaFile.width;
    const height = actualMediaFile.height;

    return {mediaId, href, src, previewSrc: previewSrc ?? undefined, width, height, downloadUrl, mimeType, textContent};
}

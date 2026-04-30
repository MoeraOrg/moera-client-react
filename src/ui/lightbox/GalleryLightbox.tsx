import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { MediaAttachment } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { closeLightbox, LightboxMediaSequence, lightboxMediaSet } from "state/lightbox/actions";
import { getLightboxMediaId, getLightboxMediaPostingId } from "state/lightbox/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { ExtCommentInfo } from "state/detailedposting/state";
import { getComment } from "state/detailedposting/selectors";
import { getSetting } from "state/settings/selectors";
import { ParentContext, useDispatcher } from "ui/hook";
import EntryHtml from "ui/entry/EntryHtml";
import Lightbox from 'ui/lightbox/Lightbox';
import LightboxReactions from "ui/lightbox/LightboxReactions";
import LightboxCopyTextButton from "ui/lightbox/LightboxCopyTextButton";
import LightboxShareButton from "ui/lightbox/LightboxShareButton";
import LightboxDownloadButton from "ui/lightbox/LightboxDownloadButton";
import { useOverlay } from "ui/overlays/overlays";
import { REL_CURRENT } from "util/rel-node-name";

export default function GalleryLightbox() {
    const posting = useSelector((state: ClientState) => getPosting(state, state.lightbox.postingId, REL_CURRENT));
    // comment === null means commentId === null
    // comment === undefined means the comment is not loaded yet
    const comment = useSelector((state: ClientState) =>
        state.lightbox.commentId != null ? getComment(state, state.lightbox.commentId) ?? undefined : null
    );
    const mediaId = useSelector(getLightboxMediaId);
    const mediaNodeName = useSelector((state: ClientState) => state.lightbox.nodeName);
    const mediaPosting = useSelector((state: ClientState) =>
        getPosting(state, getLightboxMediaPostingId(state), mediaNodeName)
    );
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, state.lightbox.nodeName));
    const loopGallery = useSelector((state: ClientState) => getSetting(state, "entry.gallery.loop") as boolean);
    const dispatch = useDispatcher();

    const onCloseRequest = useCallback(() => dispatch(closeLightbox()), [dispatch]);

    const [zIndex, overlayId] = useOverlay(null, {closeOnClick: false, closeOnEscape: false, onClose: onCloseRequest});

    const media = useMemo(() => getGallery(posting, comment), [comment, posting]);
    let mainHref = "";
    let mainSrc = "";
    let mainMimeType = "";
    let mainTextContent: string | undefined = undefined;
    let prevSrc: string | undefined = undefined;
    let prevMediaId: string | undefined = undefined;
    let prevSequence: LightboxMediaSequence = "normal";
    let nextSrc: string | undefined = undefined;
    let nextMediaId: string | undefined = undefined;
    let nextSequence: LightboxMediaSequence = "normal";
    let statusText = "";
    if (media != null && media.length > 0) {
        const loop = loopGallery && media.length > 1;
        let index = media.findIndex(attachment => attachment.media?.id === mediaId);
        if (index < 0) {
            index = 0;
        }
        const mainMedia = media[index].media;
        mainHref = "/media/" + (mainMedia?.directPath || mainMedia?.path);
        mainSrc = rootPage + mainHref;
        mainMimeType = mainMedia?.mimeType ?? "image/jpeg";
        mainTextContent = mainMedia?.textContent ?? undefined;
        const prevIndex = index > 0
            ? index - 1
            : (index === 0 && loop ? media.length - 1 : null);
        const nextIndex = index < media.length - 1
            ? index + 1
            : (index === media.length - 1 && loop ? 0 : null);
        if (prevIndex != null) {
            const prevMedia = media[prevIndex].media;
            if (prevMedia?.directPath) {
                prevSrc = rootPage + "/media/" + prevMedia.directPath;
            } else {
                prevSrc = rootPage + "/media/" + prevMedia?.path;
            }
            prevMediaId = prevMedia?.id;
            prevSequence = prevIndex > index ? "prev-loop" : "normal";
        }
        if (nextIndex != null) {
            const nextMedia = media[nextIndex].media;
            if (nextMedia?.directPath) {
                nextSrc = rootPage + "/media/" + nextMedia.directPath;
            } else {
                nextSrc = rootPage + "/media/" + nextMedia?.path;
            }
            nextMediaId = nextMedia?.id;
            nextSequence = nextIndex < index ? "next-loop" : "normal";
        }
        statusText = `${index + 1} / ${media.length}`;
    }

    const onMovePrev = () => prevMediaId != null ? dispatch(lightboxMediaSet(prevMediaId, prevSequence)) : null;

    const onMoveNext = () => nextMediaId != null ? dispatch(lightboxMediaSet(nextMediaId, nextSequence)) : null;

    return (
        <ParentContext.Provider value={{hide: onCloseRequest, overlayId}}>
            <Lightbox
                mainSrc={mainSrc}
                prevSrc={prevSrc}
                nextSrc={nextSrc}
                statusText={statusText}
                onMovePrev={onMovePrev}
                onMoveNext={onMoveNext}
                zIndex={zIndex?.shadow}
                toolbarButtons={[
                    mainTextContent && <LightboxCopyTextButton text={mainTextContent}/>,
                    <LightboxShareButton mediaNodeName={mediaNodeName} mediaHref={mainHref}/>,
                    <LightboxDownloadButton mediaUrl={mainSrc} mediaMimeType={mainMimeType}/>,
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
    const media = (entry?.media ?? []).filter(mf => !mf.media?.attachment);
    if (media.length === 0) {
        return null;
    }
    const linkPreviews = entry?.body.linkPreviews ?? [];
    if (linkPreviews.length === 0) {
        return media;
    }
    const linkPreviewImages = new Set(linkPreviews.map(lp => lp.imageHash));
    return media.filter(mf => !linkPreviewImages.has(mf.media?.hash));
}

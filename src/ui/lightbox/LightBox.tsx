import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { useTranslation } from 'react-i18next';

import { MediaAttachment } from "api";
import { ClientState } from "state/state";
import { getNamingNameRoot } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { closeLightBox, LightBoxMediaSequence, lightBoxMediaSet } from "state/lightbox/actions";
import { getLightBoxMediaId, getLightBoxMediaPostingId } from "state/lightbox/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { ExtCommentInfo } from "state/detailedposting/state";
import { getComment } from "state/detailedposting/selectors";
import { getSetting } from "state/settings/selectors";
import LightBoxCaption from "ui/lightbox/LightBoxCaption";
import LightBoxReactions from "ui/lightbox/LightBoxReactions";
import LightBoxShareButton from "ui/lightbox/LightBoxShareButton";
import LightBoxDownloadButton from "ui/lightbox/LightBoxDownloadButton";
import { useOverlay } from "ui/overlays/overlays";
import { REL_CURRENT } from "util/rel-node-name";
import { urlWithParameters } from "util/url";
import "./LightBox.css";

export default function LightBox() {
    const posting = useSelector((state: ClientState) => getPosting(state, state.lightBox.postingId, REL_CURRENT));
    const comment = useSelector((state: ClientState) =>
        state.lightBox.commentId != null ? getComment(state, state.lightBox.commentId) : null);
    const mediaId = useSelector(getLightBoxMediaId);
    const mediaNodeName = useSelector((state: ClientState) => state.lightBox.nodeName);
    const mediaPosting = useSelector((state: ClientState) =>
        getPosting(state, getLightBoxMediaPostingId(state), mediaNodeName));
    const rootPage = useSelector((state: ClientState) => getNamingNameRoot(state, state.lightBox.nodeName));
    const carte = useSelector(getCurrentViewMediaCarte);
    const loopGallery = useSelector((state: ClientState) => getSetting(state, "entry.gallery.loop") as boolean);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onCloseRequest = useCallback(() => dispatch(closeLightBox()), [dispatch]);

    const [zIndex] = useOverlay(null, {closeOnClick: false, closeOnEscape: false, onClose: onCloseRequest});

    const media = useMemo(() => getGallery(posting, comment), [comment, posting]);
    const auth = carte != null ? "carte:" + carte : null;
    let mainHref = "";
    let mainSrc = "";
    let mainMimeType = "";
    let prevSrc: string | undefined = undefined;
    let prevMediaId: string | undefined = undefined;
    let prevSequence: LightBoxMediaSequence = "normal";
    let nextSrc: string | undefined = undefined;
    let nextMediaId: string | undefined = undefined;
    let nextSequence: LightBoxMediaSequence = "normal";
    let title = "";
    if (media != null && media.length > 0) {
        const loop = loopGallery && media.length > 1;
        let index = media.findIndex(attachment => attachment.media?.id === mediaId);
        if (index < 0) {
            index = 0;
        }
        const mainMedia = media[index].media;
        if (mainMedia?.directPath) {
            mainHref = "/media/" + mainMedia.directPath;
            mainSrc = rootPage + mainHref;
        } else {
            mainHref = "/media/" + mainMedia?.path;
            mainSrc = urlWithParameters(rootPage + mainHref, {auth});
        }
        mainMimeType = mainMedia?.mimeType ?? "image/jpeg";
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
                prevSrc = urlWithParameters(rootPage + "/media/" + prevMedia?.path, {auth});
            }
            prevMediaId = prevMedia?.id;
            prevSequence = prevIndex > index ? "prev-loop" : "normal";
        }
        if (nextIndex != null) {
            const nextMedia = media[nextIndex].media;
            if (nextMedia?.directPath) {
                nextSrc = rootPage + "/media/" + nextMedia.directPath;
            } else {
                nextSrc = urlWithParameters(rootPage + "/media/" + nextMedia?.path, {auth});
            }
            nextMediaId = nextMedia?.id;
            nextSequence = nextIndex < index ? "next-loop" : "normal";
        }
        title = `${index + 1} / ${media.length}`;
    }

    const onMovePrevRequest = () => prevMediaId != null ? dispatch(lightBoxMediaSet(prevMediaId, prevSequence)) : null;

    const onMoveNextRequest = () => nextMediaId != null ? dispatch(lightBoxMediaSet(nextMediaId, nextSequence)) : null;

    return (
        <Lightbox mainSrc={mainSrc} prevSrc={prevSrc} nextSrc={nextSrc} imageTitle={title}
                  onCloseRequest={onCloseRequest} closeLabel={t("close")}
                  onMovePrevRequest={onMovePrevRequest} prevLabel={t("previous-image")}
                  onMoveNextRequest={onMoveNextRequest} nextLabel={t("next-image")}
                  reactModalStyle={{overlay: {zIndex: zIndex?.shadow}}}
                  toolbarButtons={[
                      <LightBoxShareButton mediaNodeName={mediaNodeName} mediaHref={mainHref}/>,
                      <LightBoxDownloadButton mediaUrl={mainSrc} mediaMimeType={mainMimeType}/>,
                      <LightBoxReactions/>
                  ]}
                  zoomInLabel={t("zoom-in")}
                  zoomOutLabel={t("zoom-out")}
                  imageCaption={<LightBoxCaption posting={mediaPosting}/>}/>
    );
}

function getGallery(posting: ExtPostingInfo | null, comment: ExtCommentInfo | null): MediaAttachment[] | null {
    const entry = comment != null ? comment : posting;
    const media = entry?.media;
    if (media == null) {
        return null;
    }
    const linkPreviews = entry?.body.linkPreviews ?? [];
    if (linkPreviews.length === 0) {
        return media;
    }
    const linkPreviewImages = new Set(linkPreviews.map(lp => lp.imageHash));
    return media.filter(mf => !linkPreviewImages.has(mf.media?.hash));
}

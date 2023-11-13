import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { useTranslation } from 'react-i18next';

import { MediaAttachment } from "api";
import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { closeLightBox, LightBoxMediaSequence, lightBoxMediaSet } from "state/lightbox/actions";
import { getLightBoxMediaId, getLightBoxMediaPostingId } from "state/lightbox/selectors";
import { ExtPostingInfo } from "state/postings/state";
import { getPosting } from "state/postings/selectors";
import { ExtCommentInfo } from "state/detailedposting/state";
import { getComment } from "state/detailedposting/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import { Browser } from "ui/browser";
import LightBoxCaption from "ui/lightbox/LightBoxCaption";
import LightBoxReactions from "ui/lightbox/LightBoxReactions";
import LightBoxShareButton from "ui/lightbox/LightBoxShareButton";
import LightBoxDownloadButton from "ui/lightbox/LightBoxDownloadButton";
import { urlWithParameters } from "util/url";
import "./LightBox.css";

type Props = ConnectedProps<typeof connector>;

function LightBox({
    posting, comment, mediaId, mediaPosting, mediaNodeName, rootPage, carte, loopGallery, closeLightBox,
    lightBoxMediaSet
}: Props) {
    const {t} = useTranslation();

    useEffect(() => {
        Browser.disableBodyScroll();
        return () => Browser.enableBodyScroll();
    }, []);

    const media = getGallery(posting, comment);
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
        mainHref = "/media/" + media[index].media?.path;
        mainSrc = urlWithParameters(rootPage + mainHref, {auth});
        mainMimeType = media[index].media?.mimeType ?? "image/jpeg";
        const prevIndex = index > 0
            ? index - 1
            : (index === 0 && loop ? media.length - 1 : null);
        const nextIndex = index < media.length - 1
            ? index + 1
            : (index === media.length - 1 && loop ? 0 : null);
        if (prevIndex != null) {
            prevSrc = urlWithParameters(rootPage + "/media/" + media[prevIndex].media?.path, {auth});
            prevMediaId = media[prevIndex].media?.id;
            prevSequence = prevIndex > index ? "prev-loop" : "normal";
        }
        if (nextIndex != null) {
            nextSrc = urlWithParameters(rootPage + "/media/" + media[nextIndex].media?.path, {auth});
            nextMediaId = media[nextIndex].media?.id;
            nextSequence = nextIndex < index ? "next-loop" : "normal";
        }
        title = `${index + 1} / ${media.length}`;
    }

    return (
        <Lightbox mainSrc={mainSrc} prevSrc={prevSrc} nextSrc={nextSrc} imageTitle={title}
                  onCloseRequest={() => closeLightBox()}
                  closeLabel={t("close")}
                  onMovePrevRequest={() => prevMediaId != null ? lightBoxMediaSet(prevMediaId, prevSequence) : null}
                  prevLabel={t("previous-image")}
                  onMoveNextRequest={() => nextMediaId != null ? lightBoxMediaSet(nextMediaId, nextSequence) : null}
                  nextLabel={t("next-image")}
                  reactModalStyle={{overlay: {zIndex: 1040}}}
                  toolbarButtons={[
                      <LightBoxShareButton mediaNodeName={mediaNodeName} mediaHref={mainHref} mediaUrl={mainSrc}/>,
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

const connector = connect(
    (state: ClientState) => ({
        posting: getPosting(state, state.lightBox.postingId),
        comment: state.lightBox.commentId != null ? getComment(state, state.lightBox.commentId) : null,
        mediaId: getLightBoxMediaId(state),
        mediaPosting: getPosting(state, getLightBoxMediaPostingId(state)),
        mediaNodeName: state.lightBox.nodeName,
        rootPage: state.lightBox.nodeName
            ? getNamingNameNodeUri(state, state.lightBox.nodeName)
            : getNodeRootPage(state),
        carte: getCurrentViewMediaCarte(state),
        loopGallery: getSetting(state, "entry.gallery.loop") as boolean
    }),
    { closeLightBox, lightBoxMediaSet }
);

export default connector(LightBox);

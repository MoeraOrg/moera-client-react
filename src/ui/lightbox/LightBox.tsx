import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { ClientState } from "state/state";
import { getNamingNameNodeUri } from "state/naming/selectors";
import { getCurrentViewMediaCarte } from "state/cartes/selectors";
import { closeLightBox, lightBoxMediaSet } from "state/lightbox/actions";
import { getLightBoxMediaId, getLightBoxMediaPostingId, isLightBoxShown } from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { getComment } from "state/detailedposting/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import LightBoxCaption from "ui/lightbox/LightBoxCaption";
import LightBoxReactions from "ui/lightbox/LightBoxReactions";
import LightBoxShareButton from "ui/lightbox/LightBoxShareButton";
import { urlWithParameters } from "util/url";
import "./LightBox.css";
import { ExtPostingInfo } from "state/postings/state";
import { ExtCommentInfo } from "state/detailedposting/state";
import { MediaAttachment } from "api/node/api-types";

type Props = ConnectedProps<typeof connector>;

function LightBox({show, posting, comment, mediaId, mediaPosting, rootPage, carte, loopGallery, closeLightBox,
                   lightBoxMediaSet}: Props) {
    if (!show) {
        return null;
    }

    const media = getGallery(posting, comment);
    const auth = carte != null ? "carte:" + carte : null;
    let mainSrc = "";
    let mainMimeType = "";
    let prevSrc: string | undefined = undefined;
    let prevMediaId: string | undefined = undefined;
    let nextSrc: string | undefined = undefined;
    let nextMediaId: string | undefined = undefined;
    let title = "";
    if (media != null && media.length > 0) {
        const loop = loopGallery && media.length > 1;
        let index = media.findIndex(attachment => attachment.media?.id === mediaId);
        if (index < 0) {
            index = 0;
        }
        mainSrc = urlWithParameters(rootPage + "/media/" + media[index].media?.path, {auth});
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
        }
        if (nextIndex != null) {
            nextSrc = urlWithParameters(rootPage + "/media/" + media[nextIndex].media?.path, {auth});
            nextMediaId = media[nextIndex].media?.id;
        }
        title = `${index + 1} / ${media.length}`;
    }

    const onDownload = window.Android
        ? (e: React.MouseEvent) => {
            window.Android?.saveImage(mainSrc, mainMimeType);
            e.preventDefault();
        }
        : undefined;

    return (
        <Lightbox mainSrc={mainSrc} prevSrc={prevSrc} nextSrc={nextSrc} imageTitle={title}
                  onCloseRequest={() => closeLightBox()}
                  onMovePrevRequest={() => prevMediaId != null ? lightBoxMediaSet(prevMediaId) : null}
                  onMoveNextRequest={() => nextMediaId != null ? lightBoxMediaSet(nextMediaId) : null}
                  reactModalStyle={{overlay: {zIndex: 1040}}}
                  toolbarButtons={[
                      <LightBoxShareButton mediaUrl={mainSrc}/>,
                      <a className="lightbox-button lightbox-download" href={mainSrc} download onClick={onDownload}>
                          <FontAwesomeIcon icon="file-download"/>
                      </a>,
                      <LightBoxReactions/>
                  ]}
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
        show: isLightBoxShown(state),
        posting: getPosting(state, state.lightBox.postingId),
        comment: state.lightBox.commentId != null ? getComment(state, state.lightBox.commentId) : null,
        mediaId: getLightBoxMediaId(state),
        mediaPosting: getPosting(state, getLightBoxMediaPostingId(state)),
        rootPage: state.lightBox.nodeName
            ? getNamingNameNodeUri(state, state.lightBox.nodeName)
            : getNodeRootPage(state),
        carte: getCurrentViewMediaCarte(state),
        loopGallery: getSetting(state, "entry.gallery.loop") as boolean
    }),
    { closeLightBox, lightBoxMediaSet }
);

export default connector(LightBox);

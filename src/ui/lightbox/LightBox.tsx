import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { ClientState } from "state/state";
import { closeLightBox, lightBoxMediaSet } from "state/lightbox/actions";
import { getLightBoxMediaId, isLightBoxShown } from "state/lightbox/selectors";
import { getPosting } from "state/postings/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { getSetting } from "state/settings/selectors";
import "./LightBox.css";

type Props = ConnectedProps<typeof connector>;

function LightBox({show, posting, mediaId, rootPage, loopGallery, closeLightBox, lightBoxMediaSet}: Props) {
    if (!show) {
        return null;
    }

    let mainSrc = "";
    let prevSrc: string | undefined = undefined;
    let prevMediaId: string | undefined = undefined;
    let nextSrc: string | undefined = undefined;
    let nextMediaId: string | undefined = undefined;
    let title = "";
    if (posting?.media != null && posting.media.length > 0) {
        const loop = loopGallery && posting.media.length > 1;
        let index = posting.media.findIndex(mediaFile => mediaFile.media.id === mediaId);
        if (index < 0) {
            index = 0;
        }
        mainSrc = rootPage + "/media/" + posting.media[index].media.path;
        const prevIndex = index > 0
            ? index - 1
            : (index === 0 && loop ? posting.media.length - 1 : null);
        const nextIndex = index < posting.media.length - 1
            ? index + 1
            : (index === posting.media.length - 1 && loop ? 0 : null);
        if (prevIndex != null) {
            prevSrc = rootPage + "/media/" + posting.media[prevIndex].media.path;
            prevMediaId = posting.media[prevIndex].media.id;
        }
        if (nextIndex != null) {
            nextSrc = rootPage + "/media/" + posting.media[nextIndex].media.path;
            nextMediaId = posting.media[nextIndex].media.id;
        }
        title = `${index + 1} / ${posting.media.length}`;
    }

    return (
        <Lightbox mainSrc={mainSrc} prevSrc={prevSrc} nextSrc={nextSrc} imageTitle={title}
                  onCloseRequest={() => closeLightBox()}
                  onMovePrevRequest={() => prevMediaId != null ? lightBoxMediaSet(prevMediaId) : null}
                  onMoveNextRequest={() => nextMediaId != null ? lightBoxMediaSet(nextMediaId) : null}
                  reactModalStyle={{overlay: {zIndex: 1040}}}
                  toolbarButtons={[
                      <a className="lightbox-download" href={mainSrc} download>
                          <FontAwesomeIcon icon="file-download"/>
                      </a>
                  ]}/>
    );
}

const connector = connect(
    (state: ClientState) => ({
        show: isLightBoxShown(state),
        posting: getPosting(state, state.lightBox.postingId),
        mediaId: getLightBoxMediaId(state),
        rootPage: getNodeRootPage(state),
        loopGallery: getSetting(state, "entry.gallery.loop") as boolean
    }),
    { closeLightBox, lightBoxMediaSet }
);

export default connector(LightBox);

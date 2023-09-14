import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { PostingInfo } from "api";
import { ClientState } from "state/state";
import { shareDialogPrepare } from "state/sharedialog/actions";
import { getOwnerName } from "state/node/selectors";
import { urlWithParameters, ut } from "util/url";

type Props = {
    posting: PostingInfo;
    mediaId: string;
} & ConnectedProps<typeof connector>;

function EntryGalleryShareButton({posting, mediaId, ownerName, shareDialogPrepare}: Props) {
    const {t} = useTranslation();

    const nodeName = posting.receiverName ?? ownerName ?? "";
    const postingId = posting.receiverPostingId ?? posting.id;
    const href = urlWithParameters(ut`/post/${postingId}`, {"media": mediaId});
    return (
        <button className="posting-button" onClick={() => shareDialogPrepare(nodeName, href)}>
            <FontAwesomeIcon icon="share-alt"/>
            <span className="caption">{t("share")}</span>
        </button>
    );
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state)
    }),
    { shareDialogPrepare }
);

export default connector(EntryGalleryShareButton);

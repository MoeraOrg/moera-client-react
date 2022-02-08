import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect, ConnectedProps } from 'react-redux';

import { shareDialogPrepare, sharePageCopyLink } from "state/sharedialog/actions";
import { getOwnerName } from "state/owner/selectors";
import { ClientState } from "state/state";
import { DropdownMenu } from "ui/control";
import "./PageShareButton.css";

type Props = {
    href: string;
} & ConnectedProps<typeof connector>;

function PageShareButton({href, ownerName, shareDialogPrepare, sharePageCopyLink}: Props) {
    const onShare = () => shareDialogPrepare(ownerName ?? "", href);
    const onCopyLink = () => sharePageCopyLink(ownerName ?? "", href);

    if (window.Android || navigator.share) {
        return (
            <DropdownMenu className="page-share" items={[
                {
                    title: "Share to...",
                    href,
                    onClick: onShare,
                    show: true
                },
                {
                    title: "Copy link",
                    href,
                    onClick: onCopyLink,
                    show: true
                }
            ]}>
                <FontAwesomeIcon icon="share-alt"/>
            </DropdownMenu>
        );
    } else {
        return (
            <button className="page-share" title="Share page" onClick={onShare}>
                <FontAwesomeIcon icon="share-alt"/>
            </button>
        );
    }
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state)
    }),
    { shareDialogPrepare, sharePageCopyLink }
);

export default connector(PageShareButton);

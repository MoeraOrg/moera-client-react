import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { shareDialogPrepare, sharePageCopyLink } from "state/sharedialog/actions";
import { getOwnerName } from "state/node/selectors";
import { Browser } from "ui/browser";
import { DropdownMenu } from "ui/control";
import "./PageShareButton.css";

type Props = {
    href: string;
} & ConnectedProps<typeof connector>;

function PageShareButton({href, ownerName, shareDialogPrepare, sharePageCopyLink}: Props) {
    const {t} = useTranslation();

    const onShare = () => shareDialogPrepare(ownerName ?? "", href);
    const onCopyLink = () => sharePageCopyLink(ownerName ?? "", href);

    // @ts-ignore
    if (Browser.isAndroidApp() || navigator.share) {
        return (
            <DropdownMenu className="page-share" items={[
                {
                    title: t("share-ellipsis"),
                    nodeName: ownerName ?? "",
                    href,
                    onClick: onShare,
                    show: true
                },
                {
                    title: t("copy-link"),
                    nodeName: ownerName ?? "",
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
            <button className="page-share" title={t("share-page")} onClick={onShare}>
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

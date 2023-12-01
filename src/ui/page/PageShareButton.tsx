import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { shareDialogPrepare, sharePageCopyLink } from "state/sharedialog/actions";
import { getOwnerName } from "state/node/selectors";
import { Browser } from "ui/browser";
import { DropdownMenu } from "ui/control";
import "./PageShareButton.css";

interface Props {
    href: string;
}

export default function PageShareButton({href}: Props) {
    const ownerName = useSelector(getOwnerName);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onShare = () => dispatch(shareDialogPrepare(ownerName ?? "", href));
    const onCopyLink = () => dispatch(sharePageCopyLink(ownerName ?? "", href));

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

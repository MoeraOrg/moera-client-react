import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { shareDialogPrepare, sharePageCopyLink } from "state/sharedialog/actions";
import * as Browser from "ui/browser";
import { DropdownMenu } from "ui/control";
import "./PageShareButton.css";
import { REL_CURRENT } from "util/rel-node-name";

interface Props {
    href: string;
}

export default function PageShareButton({href}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onShare = () => dispatch(shareDialogPrepare(REL_CURRENT, href));
    const onCopyLink = () => dispatch(sharePageCopyLink(REL_CURRENT, href));

    // @ts-ignore
    if (Browser.isAndroidApp() || navigator.share) {
        return (
            <DropdownMenu className="page-share" items={[
                {
                    title: t("share-ellipsis"),
                    nodeName: REL_CURRENT,
                    href,
                    onClick: onShare,
                    show: true
                },
                {
                    title: t("copy-link"),
                    nodeName: REL_CURRENT,
                    href,
                    onClick: onCopyLink,
                    show: true
                }
            ]}>
                <FontAwesomeIcon icon={faShareAlt}/>
            </DropdownMenu>
        );
    } else {
        return (
            <button className="page-share" title={t("share-page")} onClick={onShare}>
                <FontAwesomeIcon icon={faShareAlt}/>
            </button>
        );
    }
}

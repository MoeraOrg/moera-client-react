import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { ClientState } from "state/state";
import { getOwnerCard, getOwnerName, isAtHomeNode, isOwnerNameSet } from "state/node/selectors";
import { isConnectedToHome, isHomeOwnerNameSet } from "state/home/selectors";
import { isFeedGeneralLoading, isFeedGeneralReady } from "state/feeds/selectors";
import { shareDialogPrepare, sharePageCopyLink } from "state/sharedialog/actions";
import { Loading, SubscribeButton } from "ui/control";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import "./FeedSubscribeButton.css";

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;
    sharing?: boolean;
    className?: string;
}

export default function FeedSubscribeButton({nodeName, feedName, sharing, className}: Props) {
    const show = useSelector((state: ClientState) =>
        isOwnerNameSet(state) && !isAtHomeNode(state) && isConnectedToHome(state) && isHomeOwnerNameSet(state)
    );
    const ownerName = useSelector(getOwnerName);
    const generalReady = useSelector((state: ClientState) => isFeedGeneralReady(state, nodeName, feedName));
    const generalLoading = useSelector((state: ClientState) => isFeedGeneralLoading(state, nodeName, feedName));
    const subscription = useSelector((state: ClientState) => getOwnerCard(state)?.subscription);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (ownerName == null || !show) {
        return null;
    }

    const onCopyLink = () => dispatch(sharePageCopyLink(REL_CURRENT, "/"));

    const onShare = () => dispatch(shareDialogPrepare(REL_CURRENT, "/"));

    return (
        <div className={cx("feed-subscribe-button", className)}>
            {(generalReady && (subscription?.loaded ?? false)) &&
                <SubscribeButton nodeName={ownerName} feedName={feedName} addon={[
                    {
                        title: t("copy-link"),
                        nodeName: REL_CURRENT,
                        href: "/",
                        onClick: onCopyLink,
                        show: sharing ?? false
                    },
                    {
                        title: t("share"),
                        nodeName: REL_CURRENT,
                        href: "/",
                        onClick: onShare,
                        opensDialog: true,
                        show: sharing ?? false
                    },
                ]}/>
            }
            {(generalLoading || subscription?.loading) && <Loading/>}
        </div>
    );
}

import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getOwnerAvatar, getOwnerName } from "state/node/selectors";
import { Avatar } from "ui/control";
import Jump from "ui/navigation/Jump";
import PageHeader from "ui/page/PageHeader";
import PageShareButton from "ui/page/PageShareButton";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import FeedGotoButton from "ui/feed/FeedGotoButton";
import { getPageHeaderHeight } from "util/ui";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;
    title: string;
    empty?: boolean;
    shareable?: boolean;
    atBottom: boolean;
}

export default function FeedPageHeader({nodeName, feedName, title, empty = false, shareable = false, atBottom}: Props) {
    const avatar = useSelector(getOwnerAvatar);
    const ownerName = useSelector(getOwnerName);

    const [avatarVisible, setAvatarVisible] = useState(window.scrollY >= getPageHeaderHeight());
    const {t} = useTranslation();

    const onScroll = useCallback(
        () => setAvatarVisible(window.scrollY >= getPageHeaderHeight()),
        [setAvatarVisible]
    );

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, [onScroll]);

    return (
        <PageHeader>
            <h2>
                {avatarVisible &&
                    <Jump href="/profile" title={t("profile")} className="avatar-link">
                        <Avatar avatar={avatar} ownerName={ownerName} size={40}/>
                    </Jump>
                }
                {title}
                <FeedSubscribeButton nodeName={nodeName} feedName={feedName}/>
                {shareable && <PageShareButton href="/"/>}
            </h2>
            <div className="page-header-buttons">
                {!empty && <FeedGotoButton nodeName={nodeName} feedName={feedName} atBottom={atBottom}/>}
            </div>
        </PageHeader>
    );
}

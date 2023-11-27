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
import FeedTopButton from "ui/feed/FeedTopButton";
import { Browser } from "ui/browser";
import { getPageHeaderHeight } from "util/misc";

interface Props {
    feedName: string;
    title: string;
    empty?: boolean;
    shareable?: boolean;
    atTop: boolean;
    atBottom: boolean;
    totalAfterTop: number;
    notViewed: number;
    notViewedMoment: number | null;
}

export default function FeedPageHeader({
    feedName, title, empty = false, shareable = false, atTop, atBottom, totalAfterTop, notViewed, notViewedMoment
}: Props) {
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
                <FeedSubscribeButton feedName={feedName} small={Browser.isTinyScreen()}/>
                {shareable && <PageShareButton href="/"/>}
            </h2>
            <div className="page-header-buttons">
                {!empty && <FeedGotoButton feedName={feedName} atBottom={atBottom}/>}
            </div>
            <FeedTopButton feedName={feedName} atTop={atTop} totalAfterTop={totalAfterTop} notViewed={notViewed}
                           notViewedMoment={notViewedMoment}/>
        </PageHeader>
    );
}

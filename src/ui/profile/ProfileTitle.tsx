import React from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerAvatar, getOwnerCard, getOwnerFullName, getOwnerName, getOwnerTitle } from "state/node/selectors";
import { Avatar, DonateButton, OnlyMobile } from "ui/control";
import Jump from "ui/navigation/Jump";
import MobileBack from "ui/page/MobileBack";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import { mentionName } from "util/names";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "./ProfileTitle.css";

export default function ProfileTitle() {
    const nodeName = useSelector(getOwnerName);
    const fullName = useSelector(getOwnerFullName);
    const title = useSelector(getOwnerTitle);
    const avatar = useSelector(getOwnerAvatar);
    const card = useSelector(getOwnerCard);
    const storiesTotal = card?.stories.storiesTotal ?? "?";
    const subscribersTotal = card?.people.subscribersTotal ?? "?";
    const fundraisers = useSelector((state: ClientState) => state.profile.profile.fundraisers);
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    return (
        <>
            <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                {fullName || NodeName.shorten(nodeName)}
            </MobileBack>
            <OnlyMobile>
                <div id="profile-title">
                    <div className="panel">
                        <Jump href="/profile" title={t("profile")} className="avatar-link">
                            <Avatar avatar={avatar} ownerName={nodeName} size={64}/>
                        </Jump>
                        <div className="counter">
                            <Trans i18nKey="count-posts" values={{count: storiesTotal}}><em/></Trans>
                        </div>
                        <Jump className="counter" href="/people/subscribers">
                            <Trans i18nKey="count-subscribers" values={{count: subscribersTotal}}><em/></Trans>
                        </Jump>
                    </div>
                    <div className="mention">{mentionName(nodeName)}</div>
                    {title && <div className="title">{title}</div>}
                    <div className="subscribe-line">
                        <FeedSubscribeButton nodeName={nodeName ?? REL_CURRENT} feedName="timeline"/>
                        <DonateButton name={nodeName} fullName={fullName} fundraisers={fundraisers ?? null}
                                      styles="icon"/>
                    </div>
                </div>
            </OnlyMobile>
        </>
    );
}

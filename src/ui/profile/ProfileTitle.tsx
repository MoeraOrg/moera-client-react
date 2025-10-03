import React from 'react';
import { useSelector } from 'react-redux';
import { Trans } from 'react-i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerAvatar, getOwnerCard, getOwnerFullName, getOwnerName, getOwnerTitle } from "state/node/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { DonateButton, OnlyMobile } from "ui/control";
import Jump from "ui/navigation/Jump";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import MobileBack from "ui/page/MobileBack";
import ProfileAvatar from "ui/profile/ProfileAvatar";
import ManagementMenuItems from "ui/profile/manage/ManagementMenuItems";
import OperationStatus from "ui/profile/manage/OperationStatus";
import { useHomeNews } from "ui/feed/feeds";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import { mentionName } from "util/names";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "./ProfileTitle.css";

export default function ProfileTitle() {
    const connectedToHome = useSelector(isConnectedToHome);
    const nodeName = useSelector(getOwnerName);
    const fullName = useSelector(getOwnerFullName);
    const name = fullName || NodeName.shorten(nodeName);
    const title = useSelector(getOwnerTitle);
    const avatar = useSelector(getOwnerAvatar);
    const card = useSelector(getOwnerCard);
    const storiesTotal = card?.stories.storiesTotal ?? "?";
    const subscribersTotal = card?.people.subscribersTotal ?? "?";
    const fundraisers = useSelector((state: ClientState) => state.profile.profile.fundraisers);
    const newsHref = useHomeNews();

    return (
        <>
            {connectedToHome ?
                <MobileBack nodeName={REL_HOME} href={newsHref} menuContent={<ManagementMenuItems/>} sticky>
                    {name}
                </MobileBack>
            :
                <MobileMainMenu/>
            }
            <OnlyMobile>
                <aside id="profile-title">
                    <div className="panel">
                        <ProfileAvatar avatar={avatar} ownerName={nodeName} size={64}/>
                        <div className="counter">
                            <Trans i18nKey="count-posts" values={{count: storiesTotal}}><em/></Trans>
                        </div>
                        <Jump className="counter" href="/people/subscribers">
                            <Trans i18nKey="count-subscribers" values={{count: subscribersTotal}}><em/></Trans>
                        </Jump>
                    </div>
                    {!connectedToHome && <div className="full-name">{name}</div>}
                    <div className="mention">{mentionName(nodeName)}</div>
                    <OperationStatus/>
                    {title && <div className="title">{title}</div>}
                    <div className="subscribe-line">
                        <FeedSubscribeButton nodeName={nodeName ?? REL_CURRENT} feedName="timeline"/>
                        <DonateButton name={nodeName} fullName={fullName} fundraisers={fundraisers ?? null}
                                      styles="icon"/>
                    </div>
                </aside>
            </OnlyMobile>
        </>
    );
}

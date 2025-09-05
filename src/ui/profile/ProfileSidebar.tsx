import React from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { getOwnerAvatar, getOwnerCard, getOwnerFullName, getOwnerName, getOwnerTitle } from "state/node/selectors";
import { Avatar, DonateButton, OnlyDesktop } from "ui/control";
import Jump from "ui/navigation/Jump";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import EntryHtml from "ui/entry/EntryHtml";
import { mentionName } from "util/names";
import { REL_CURRENT } from "util/rel-node-name";
import "./ProfileSidebar.css";

export default function ProfileSidebar() {
    const nodeName = useSelector(getOwnerName);
    const fullName = useSelector(getOwnerFullName);
    const title = useSelector(getOwnerTitle);
    const avatar = useSelector(getOwnerAvatar);
    const card = useSelector(getOwnerCard);
    const profile = card?.details?.profile;
    const storiesTotal = card?.stories.storiesTotal ?? "?";
    const subscribersTotal = card?.people.subscribersTotal ?? "?";
    const fundraisers = useSelector((state: ClientState) => state.profile.profile.fundraisers);
    const {t} = useTranslation();

    return (
        <OnlyDesktop>
            <div id="profile-sidebar">
                <div className="panel">
                    <Jump href="/profile" title={t("profile")} className="avatar-link">
                        <Avatar avatar={avatar} ownerName={nodeName} size={96}/>
                    </Jump>
                    <FeedSubscribeButton nodeName={nodeName ?? REL_CURRENT} feedName="timeline"/>
                </div>
                <div className="full-name">
                    {fullName || NodeName.shorten(nodeName)}
                </div>
                <div className="mention">{mentionName(nodeName)}</div>
                {title && <div className="title">{title}</div>}
                <div className="counters-line">
                    <div className="counter">
                        <Trans i18nKey="count-posts" values={{count: storiesTotal}}><em/></Trans>
                    </div>
                    <Jump className="counter" href="/people/subscribers">
                        <Trans i18nKey="count-subscribers" values={{count: subscribersTotal}}><em/></Trans>
                    </Jump>
                </div>
                {profile?.bioHtml &&
                    <div className="bio">
                        <EntryHtml html={profile.bioHtml} nodeName={REL_CURRENT}/>
                    </div>
                }
                {profile?.email &&
                    <div className="email">
                        <span className="title">{t("e-mail")}:</span>{" "}
                        <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    </div>
                }
                <DonateButton name={nodeName} fullName={fullName} fundraisers={fundraisers ?? null}/>
            </div>
        </OnlyDesktop>
    );
}

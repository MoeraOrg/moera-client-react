import React from 'react';
import { useSelector } from 'react-redux';
import { format, formatISO, fromUnixTime } from 'date-fns';
import { Trans, useTranslation } from 'react-i18next';

import { AvatarImage, NodeName } from "api";
import { tDistanceToNow } from "i18n/time";
import { ClientState } from "state/state";
import { getNodeCard, isNodeCardAnyLoaded, isNodeCardAnyLoading } from "state/nodecards/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { useIsTinyScreen } from "ui/hook/media-query";
import { Avatar, DonateButton, Loading, SubscribeButton, usePopover } from "ui/control";
import Jump from "ui/navigation/Jump";
import { mentionName, shortGender } from "util/names";
import { RelNodeName } from "util/rel-node-name";
import "./NodeCard.css";

interface Props {
    nodeName: string;
    fullName?: string | null;
    avatar?: AvatarImage | null;
    avatarNodeName?: RelNodeName | string;
}

export default function NodeCard({nodeName, fullName, avatar, avatarNodeName}: Props) {
    const card = useSelector((state: ClientState) => getNodeCard(state, nodeName));
    const anyLoaded = useSelector((state: ClientState) => isNodeCardAnyLoaded(state, nodeName));
    const anyLoading = useSelector((state: ClientState) => isNodeCardAnyLoading(state, nodeName));
    const homeOwnerName = useSelector(getHomeOwnerName);
    const tinyScreen = useIsTinyScreen();
    const {t} = useTranslation();

    const {hide: hidePopover} = usePopover();

    if (card == null || (!anyLoaded && !anyLoading)) {
        return (
            <div className="node-card">
                <div className="unknown">{t("unknown-name")}</div>
            </div>
        );
    }

    const realFullName = card.details.profile.fullName ?? (fullName || NodeName.shorten(nodeName));
    const realAvatar =  card.details.profile.avatar ?? avatar ?? null;
    const realAvatarNodeName = card.details.profile.avatar != null ? nodeName : avatarNodeName;
    const gender = shortGender(card.details.profile.gender ?? "male", t);
    const storiesTotal = card.stories.storiesTotal ?? "?";
    const storiesLastDate = card.stories.lastStoryCreatedAt != null
        ? fromUnixTime(card.stories.lastStoryCreatedAt)
        : null;
    const subscribersTotal = card.people.subscribersTotal ?? "?";
    const subscriptionsTotal = card.people.subscriptionsTotal ?? "?";
    const {details: {profile: {title, fundraisers}}} = card;

    return (
        <div className="node-card">
            <div className="main">
                <Jump nodeName={nodeName} href="/profile" title={t("profile")} className="avatar-link">
                    <Avatar avatar={realAvatar} ownerName={nodeName} size={tinyScreen ? 64 : 100}
                            nodeName={realAvatarNodeName}/>
                </Jump>
                <div className="body">
                    {realFullName &&
                        <div>
                            <Jump className="full-name" nodeName={nodeName} href="/">{realFullName}</Jump>
                            {gender && <span className="gender">{gender}</span>}
                        </div>
                    }
                    <div>
                        <Jump className="name" nodeName={nodeName} href="/">{mentionName(nodeName)}</Jump>
                    </div>
                    {title && <div className="title">{title}</div>}
                    <DonateButton name={nodeName} fullName={fullName ?? null} fundraisers={fundraisers ?? null}
                                  styles="small"/>
                </div>
            </div>
            <div className="stories">
                <span className="counter">
                    <Trans i18nKey="count-posts" values={{count: storiesTotal}}><em/></Trans>
                    {storiesLastDate &&
                        <>
                            {`, ${t("last-post")} `}
                            <time dateTime={formatISO(storiesLastDate)}
                                  title={format(storiesLastDate, "dd-MM-yyyy HH:mm")}>
                                {tDistanceToNow(storiesLastDate, t, {ago: true})}
                            </time>
                        </>
                    }
                </span>
            </div>
            <div className="people">
                <Jump className="counter" nodeName={nodeName} href="/people/subscribers">
                    <Trans i18nKey="count-subscribers" values={{count: subscribersTotal}}><em/></Trans>
                </Jump>
                <Jump className="counter" nodeName={nodeName} href="/people/subscriptions">
                    <Trans i18nKey="count-subscriptions" values={{count: subscriptionsTotal}}><em/></Trans>
                </Jump>
            </div>
            <div className="buttons">
                {(homeOwnerName != null && nodeName !== homeOwnerName && (card.subscription.loaded ?? false)) &&
                    <SubscribeButton nodeName={nodeName} feedName="timeline" onDialogOpened={hidePopover}/>
                }
            </div>
            {anyLoading && <Loading/>}
        </div>
    );
}

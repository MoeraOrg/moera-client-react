import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { isProfileEditable } from "state/profile/selectors";
import { getOwnerCard, getOwnerName } from "state/node/selectors";
import { Avatar, DonateButton, Loading } from "ui/control";
import Jump from "ui/navigation/Jump";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { Page } from "ui/page/Page";
import MobileBack from "ui/page/MobileBack";
import DesktopBack from "ui/page/DesktopBack";
import PageShareButton from "ui/page/PageShareButton";
import { getFeedBackTitle } from "ui/feed/feeds";
import FeedSubscribeButton from "ui/feed/FeedSubscribeButton";
import NodeNameView from "ui/profile/view/NodeNameView";
import EntryHtml from "ui/entry/EntryHtml";
import { shortGender } from "util/names";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "./ProfilePage.css";

export default function ProfilePage() {
    const loading = useSelector((state: ClientState) => getOwnerCard(state)?.details?.loading ?? true);
    const profile = useSelector((state: ClientState) => getOwnerCard(state)?.details?.profile);
    const ownerName = useSelector(getOwnerName);
    const editable = useSelector(isProfileEditable);
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    return (
        <Page className="profile-page">
            <div className="page-central-pane">
                <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                    {t("profile")}
                    {loading && <Loading/>}
                </MobileBack>
                <DesktopBack nodeName={REL_HOME} href={newsHref}>
                    {getFeedBackTitle("news", t)}
                    {loading && <Loading/>}
                </DesktopBack>
                <div className="profile-view content-panel">
                    <Avatar avatar={profile?.avatar} ownerName={ownerName} size={200}/>
                    <div className="full-name">
                        {profile?.fullName ?? NodeName.shorten(ownerName)}
                        {profile?.gender && <span className="gender">{shortGender(profile.gender, t)}</span>}
                        <PageShareButton href="/profile"/>
                    </div>
                    <NodeNameView/>
                    {profile?.title && <div className="title">{profile.title}</div>}
                    <FeedSubscribeButton nodeName={REL_CURRENT} feedName="timeline"/>
                    {editable &&
                        <div className="mt-2 mb-3">
                            <Jump className="btn btn-outline-primary" href="/settings/profile#profile">
                                {t("edit")}
                            </Jump>
                        </div>
                    }
                    <DonateButton name={ownerName} fullName={profile?.fullName ?? null}
                                  fundraisers={profile?.fundraisers ?? null} className="donate"/>
                    {profile?.email &&
                        <div className="email">
                            <span className="title">{t("e-mail")}:</span>{" "}
                            <a href={`mailto:${profile.email}`}>{profile.email}</a>
                        </div>
                    }
                    {profile?.bioHtml && <EntryHtml className="bio" html={profile.bioHtml} nodeName={REL_CURRENT}/>}
                </div>
            </div>
            <BottomMenu/>
        </Page>
    );
}

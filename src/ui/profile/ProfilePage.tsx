import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getOwnerCard } from "state/node/selectors";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import NewsCounter from "ui/mainmenu/NewsCounter";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { Page } from "ui/page/Page";
import DesktopBack from "ui/page/DesktopBack";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import ProfileSidebar from "ui/profile/ProfileSidebar";
import ProfileTitle from "ui/profile/ProfileTitle";
import ProfileTabs from "ui/profile/ProfileTabs";
import EntryHtml from "ui/entry/EntryHtml";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import "./ProfilePage.css";

export default function ProfilePage() {
    const profile = useSelector((state: ClientState) => getOwnerCard(state)?.details?.profile);
    const newsHref = useMainMenuHomeNews().href;
    const {t} = useTranslation();

    return (
        <Page className="profile-page tabbed-page">
            <div className="page-left-pane">
                <ProfileSidebar/>
            </div>
            <div className="page-central-pane">
                <ProfileTitle/>
                <BackBox>
                    <BackBoxInner>
                        <DesktopBack nodeName={REL_HOME} href={newsHref}>
                            {t("back-news")}<NewsCounter/>
                        </DesktopBack>
                        <ProfileTabs value="about"/>
                    </BackBoxInner>
                </BackBox>
                <div className="content-panel">
                    {profile?.bioHtml && <EntryHtml className="bio" html={profile.bioHtml} nodeName={REL_CURRENT}/>}
                    {profile?.email &&
                        <p>
                            <b>{t("e-mail")}:</b>{" "}
                            <a href={`mailto:${profile.email}`}>{profile.email}</a>
                        </p>
                    }
                </div>
            </div>
            <BottomMenu/>
        </Page>
    );
}

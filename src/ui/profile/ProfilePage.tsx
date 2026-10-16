import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getOwnerCard, getOwnerFullName, getOwnerName, getOwnerSourceUri } from "state/node/selectors";
import { useHomeNews } from "ui/feed/feeds";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { Page } from "ui/page/Page";
import DesktopBack from "ui/page/DesktopBack";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import ProfileSidebar from "ui/profile/ProfileSidebar";
import ProfileTitle from "ui/profile/ProfileTitle";
import ProfileTabs from "ui/profile/ProfileTabs";
import ProfileSourceDisclaimer from "ui/profile/ProfileSourceDisclaimer";
import EntryHtml from "ui/entry/EntryHtml";
import { REL_CURRENT, REL_HOME } from "util/rel-node-name";
import { formatFullName } from "util/names";
import "./ProfilePage.css";

export default function ProfilePage() {
    const profile = useSelector((state: ClientState) => getOwnerCard(state)?.details?.profile);
    const nodeName = useSelector(getOwnerName);
    const fullName = useSelector(getOwnerFullName);
    const sourceUri = useSelector(getOwnerSourceUri);
    const newsHref = useHomeNews();
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
                            {t("back-news")}
                        </DesktopBack>
                        <ProfileTabs value="about"/>
                    </BackBoxInner>
                </BackBox>
                <main className="content-panel">
                    {(profile?.bioHtml || sourceUri) &&
                        <>
                            <EntryHtml className="bio" html={profile?.bioHtml} nodeName={REL_CURRENT}/>
                            <ProfileSourceDisclaimer nodeSourceUri={sourceUri}
                                                     title={formatFullName(nodeName, fullName)}/>
                        </>
                    }
                    {profile?.email &&
                        <p>
                            <b>{t("e-mail")}:</b>{" "}
                            <a href={`mailto:${profile.email}`}>{profile.email}</a>
                        </p>
                    }
                </main>
            </div>
            <div className="page-right-pane">
                <MainMenuSidebar/>
            </div>
            <BottomMenu/>
        </Page>
    );
}

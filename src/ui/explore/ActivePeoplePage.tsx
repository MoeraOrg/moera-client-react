import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { NodeName as NodeNameFormat } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { AvatarWithPopup, Loading, SubscribeButton } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import MobileBack from "ui/page/MobileBack";
import { useHomeNews } from "ui/feed/feeds";
import ExploreTabs from "ui/explore/ExploreTabs";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { REL_HOME } from "util/rel-node-name";
import "./ActivePeoplePage.css";

export default function ActivePeoplePage() {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const newsHref = useHomeNews();
    const loading = useSelector((state: ClientState) => state.explore.loadingActivePeople);
    const people = useSelector((state: ClientState) => state.explore.activePeople);
    const {t} = useTranslation();

    return (
        <>
            <Page className="active-people-page explore-page tabbed-page">
                <div className="page-left-pane">
                    <MainMenuSidebar selected="explore"/>
                </div>
                <div className="page-central-pane">
                    <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                        {tTitle(t("explore-people"))}
                    </MobileBack>
                    <BackBox>
                        <BackBoxInner>
                            <ExploreTabs value="people"/>
                        </BackBoxInner>
                    </BackBox>
                    <div className="content-panel">
                        {people.map(node =>
                            <div className="person" key={node.nodeName}>
                                <AvatarWithPopup ownerName={node.nodeName} ownerFullName={node.fullName}
                                                 avatar={node.avatar} size={40}/>
                                <div className="details">
                                    <NodeName className="full-name" name={node.nodeName} fullName={node.fullName}
                                              display="full-name"/>
                                    <span className="name">{NodeNameFormat.shorten(node.nodeName)}</span>
                                </div>
                                {node.nodeName !== homeOwnerName &&
                                    <SubscribeButton nodeName={node.nodeName} feedName="timeline"/>
                                }
                                <span className="title">{node.title}</span>
                            </div>
                        )}
                        {loading && <Loading/>}
                    </div>
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
};

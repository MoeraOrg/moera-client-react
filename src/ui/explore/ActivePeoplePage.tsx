import React from 'react';
import { useSelector } from 'react-redux';

import { NodeName as NodeNameFormat } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { AvatarWithPopup, Loading, SubscribeButton } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import { Page } from "ui/page/Page";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import ExploreTabs from "ui/explore/ExploreTabs";
import "./ActivePeoplePage.css";

export default function ActivePeoplePage() {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const loading = useSelector((state: ClientState) => state.explore.loadingActivePeople);
    const people = useSelector((state: ClientState) => state.explore.activePeople);

    return (
        <>
            <Page className="active-people-page explore-page tabbed-page">
                <div className="page-left-pane">
                    <MainMenuSidebar/>
                </div>
                <div className="page-central-pane">
                    <MobileMainMenu/>
                    <BackBox>
                        <BackBoxInner>
                            <ExploreTabs value="people"/>
                        </BackBoxInner>
                    </BackBox>
                    <main className="content-panel">
                        {people.map(node =>
                            <div className="person" key={node.nodeName}>
                                <AvatarWithPopup ownerName={node.nodeName} ownerFullName={node.fullName}
                                                 avatar={node.avatar} size={40}/>
                                <div className="details">
                                    <NodeName className="full-name" name={node.nodeName} fullName={node.fullName}
                                              display="full-name"/>
                                    <span className="name">{NodeNameFormat.shorten(node.nodeName)}</span>
                                </div>
                                {homeOwnerName && node.nodeName !== homeOwnerName &&
                                    <SubscribeButton nodeName={node.nodeName} feedName="timeline"/>
                                }
                                <span className="title">{node.title}</span>
                            </div>
                        )}
                        {loading && <Loading/>}
                    </main>
                </div>
            </Page>
            <BottomMenu/>
        </>
    );
};

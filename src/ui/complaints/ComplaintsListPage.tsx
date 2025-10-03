import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createSelector } from 'reselect';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { complaintsInboxSet, complaintsPastSliceLoad } from "state/complaints/actions";
import { Button } from "ui/control";
import { Icon, msInbox } from "ui/material-symbols";
import { Page } from "ui/page/Page";
import DesktopBack from "ui/page/DesktopBack";
import BackBox from "ui/page/BackBox";
import BackBoxInner from "ui/page/BackBoxInner";
import { useHomeNews } from "ui/feed/feeds";
import NewsCounter from "ui/mainmenu/NewsCounter";
import BottomMenu from "ui/mainmenu/BottomMenu";
import ProfileSidebar from "ui/profile/ProfileSidebar";
import ProfileTabs from "ui/profile/ProfileTabs";
import ProfileTitle from "ui/profile/ProfileTitle";
import ComplaintGroupLine from "ui/complaints/ComplaintGroupLine";
import ComplaintsSentinel from "ui/complaints/ComplaintsSentinel";
import { REL_HOME } from "util/rel-node-name";
import "./ComplaintsListPage.css";

export default function ComplaintsListPage() {
    const connectedToHome = useSelector(isConnectedToHome);
    const complaintGroups = useSelector(getComplaintGroups);
    const loadingPast = useSelector((state: ClientState) => state.complaints.loadingPast);
    const total = useSelector((state: ClientState) => state.complaints.total);
    const totalInPast = useSelector((state: ClientState) => state.complaints.totalInPast);
    const before = useSelector((state: ClientState) => state.complaints.before);
    const inboxOnly = useSelector((state: ClientState) => state.complaints.inboxOnly);
    const newsHref = useHomeNews();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onLoadPast = () => dispatch(complaintsPastSliceLoad());

    const onInboxToggle = () => dispatch(complaintsInboxSet(!inboxOnly));

    return (
        <Page className="complaints tabbed-page">
            <div className="page-left-pane">
                <ProfileSidebar/>
            </div>
            <div className="page-central-pane">
                <ProfileTitle/>
                <BackBox>
                    <BackBoxInner noShadow>
                        {connectedToHome &&
                            <DesktopBack nodeName={REL_HOME} href={newsHref}>
                                {t("back-news")}<NewsCounter/>
                            </DesktopBack>
                        }
                        <ProfileTabs value="complaints"/>
                    </BackBoxInner>
                </BackBox>
                <main className="content-panel">
                    <div className="navigator">
                        <div className="total">{`${t("total-colon")} ${total}`}</div>
                        <Button variant="tool-round" active={inboxOnly} title={t("only-new")} onClick={onInboxToggle}>
                            <Icon icon={msInbox} size={20}/>
                        </Button>
                    </div>
                    {complaintGroups.map(group =>
                        group != null && <ComplaintGroupLine key={group.id} group={group}/>
                    )}
                    <ComplaintsSentinel
                        loading={loadingPast}
                        title={
                            complaintGroups.length !== 0
                                ? t("view-previous-complaints")
                                : t("view-complaints")
                        }
                        total={totalInPast}
                        visible={total > 0 && before < Number.MAX_SAFE_INTEGER}
                        onClick={onLoadPast}
                    />
                </main>
            </div>
            <BottomMenu/>
        </Page>
    );
}

const getComplaintGroups = createSelector(
    (state: ClientState) => state.complaints.complaintGroupList,
    (state: ClientState) => state.complaints.complaintGroups,
    (list, groups) => list.map(id => groups[id])
);

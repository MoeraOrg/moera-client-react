import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createSelector } from 'reselect';

import { ClientState } from "state/state";
import { complaintsInboxSet, complaintsPastSliceLoad } from "state/complaints/actions";
import { Button } from "ui/control";
import { Icon, msInbox } from "ui/material-symbols";
import { Page } from "ui/page/Page";
import DesktopBack from "ui/page/DesktopBack";
import MobileBack from "ui/page/MobileBack";
import { useMainMenuHomeNews } from "ui/mainmenu/pages/main-menu";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { getFeedBackTitle } from "ui/feed/feeds";
import ComplaintGroupLine from "ui/complaints/ComplaintGroupLine";
import ComplaintsSentinel from "ui/complaints/ComplaintsSentinel";
import { REL_HOME } from "util/rel-node-name";
import "./ComplaintsListPage.css";

export default function ComplaintsListPage() {
    const complaintGroups = useSelector(getComplaintGroups);
    const loadingPast = useSelector((state: ClientState) => state.complaints.loadingPast);
    const total = useSelector((state: ClientState) => state.complaints.total);
    const totalInPast = useSelector((state: ClientState) => state.complaints.totalInPast);
    const before = useSelector((state: ClientState) => state.complaints.before);
    const inboxOnly = useSelector((state: ClientState) => state.complaints.inboxOnly);
    const newsHref = useMainMenuHomeNews().href;
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onLoadPast = () => dispatch(complaintsPastSliceLoad());

    const onInboxToggle = () => dispatch(complaintsInboxSet(!inboxOnly));

    return (
        <Page className="complaints">
            <div className="page-central-pane">
                <MobileBack nodeName={REL_HOME} href={newsHref} sticky>
                    {t("complaints")}
                </MobileBack>
                <DesktopBack nodeName={REL_HOME} href={newsHref}>
                    {getFeedBackTitle("news", t)}
                </DesktopBack>
                <div className="content-panel">
                    <div className="navigator">
                        <div className="total">{`${t("total-colon")} ${total}`}</div>
                        <div className="title">{t("complaints")}</div>
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
                </div>
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

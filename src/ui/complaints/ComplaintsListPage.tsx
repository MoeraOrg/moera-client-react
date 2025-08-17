import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createSelector } from 'reselect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

import { ClientState } from "state/state";
import { complaintsInboxSet, complaintsPastSliceLoad } from "state/complaints/actions";
import { Button } from "ui/control";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import ComplaintGroupLine from "ui/complaints/ComplaintGroupLine";
import ComplaintsSentinel from "ui/complaints/ComplaintsSentinel";
import "./ComplaintsListPage.css";

export default function ComplaintsListPage() {
    const complaintGroups = useSelector(getComplaintGroups);
    const loadingPast = useSelector((state: ClientState) => state.complaints.loadingPast);
    const total = useSelector((state: ClientState) => state.complaints.total);
    const totalInPast = useSelector((state: ClientState) => state.complaints.totalInPast);
    const before = useSelector((state: ClientState) => state.complaints.before);
    const inboxOnly = useSelector((state: ClientState) => state.complaints.inboxOnly);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onLoadPast = () => dispatch(complaintsPastSliceLoad());

    const onInboxToggle = () => dispatch(complaintsInboxSet(!inboxOnly));

    return (
        <>
            <PageHeader>
                <h2>{t("complaints")}</h2>
            </PageHeader>
            <Page>
                <div className="page-central-pane complaints content-panel">
                    <div className="navigator">
                        <div className="total">{`${t("total-colon")} ${total}`}</div>
                        <Button variant={inboxOnly ? "primary" : "outline-secondary"} size="sm" title={t("only-new")}
                                onClick={onInboxToggle}>
                            <FontAwesomeIcon icon={faInbox}/>
                        </Button>
                    </div>
                    {complaintGroups.map(group =>
                        group != null && <ComplaintGroupLine key={group.id} group={group}/>
                    )}
                    <ComplaintsSentinel loading={loadingPast}
                                        title={
                                            complaintGroups.length !== 0
                                                ? t("view-previous-complaints")
                                                : t("view-complaints")
                                       } total={totalInPast} visible={total > 0 && before < Number.MAX_SAFE_INTEGER}
                                        onClick={onLoadPast}/>
                </div>
            </Page>
        </>
    );
}

const getComplaintGroups = createSelector(
    (state: ClientState) => state.complaints.complaintGroupList,
    (state: ClientState) => state.complaints.complaintGroups,
    (list, groups) => list.map(id => groups[id])
);

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createSelector } from 'reselect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

import { ClientState } from "state/state";
import { complainsInboxSet, complainsPastSliceLoad } from "state/complains/actions";
import { Button } from "ui/control";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import ComplainGroupLine from "ui/complains/ComplainGroupLine";
import ComplainsSentinel from "ui/complains/ComplainsSentinel";
import "./ComplainsListPage.css";

export default function ComplainsListPage() {
    const complainGroups = useSelector(getComplainGroups);
    const loadingPast = useSelector((state: ClientState) => state.complains.loadingPast);
    const total = useSelector((state: ClientState) => state.complains.total);
    const totalInPast = useSelector((state: ClientState) => state.complains.totalInPast);
    const before = useSelector((state: ClientState) => state.complains.before);
    const inboxOnly = useSelector((state: ClientState) => state.complains.inboxOnly);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onLoadPast = () => dispatch(complainsPastSliceLoad());

    const onInboxToggle = () => dispatch(complainsInboxSet(!inboxOnly));

    return (
        <>
            <PageHeader>
                <h2>{t("complains")}</h2>
            </PageHeader>
            <Page>
                <div className="complains content-panel">
                    <div className="navigator">
                        <div className="total">{`${t("total-colon")} ${total}`}</div>
                        <Button variant={inboxOnly ? "primary" : "outline-secondary"} size="sm" title={t("only-new")}
                                onClick={onInboxToggle}>
                            <FontAwesomeIcon icon={faInbox}/>
                        </Button>
                    </div>
                    {complainGroups.map(group =>
                        group != null && <ComplainGroupLine key={group.id} group={group}/>
                    )}
                    <ComplainsSentinel loading={loadingPast}
                                       title={
                                            complainGroups.length !== 0
                                                ? t("view-previous-complains")
                                                : t("view-complains")
                                       } total={totalInPast} visible={total > 0 && before < Number.MAX_SAFE_INTEGER}
                                       onClick={onLoadPast}/>
                </div>
            </Page>
        </>
    );
}

const getComplainGroups = createSelector(
    (state: ClientState) => state.complains.complainGroupList,
    (state: ClientState) => state.complains.complainGroups,
    (list, groups) => list.map(id => groups[id])
);

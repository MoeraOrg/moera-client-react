import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createSelector } from 'reselect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { complainsInboxSet, complainsPastSliceLoad } from "state/complains/actions";
import { Button } from "ui/control";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import ComplainGroupLine from "ui/complains/ComplainGroupLine";
import ComplainsSentinel from "ui/complains/ComplainsSentinel";
import "./ComplainsListPage.css";

type Props = ConnectedProps<typeof connector>;

function ComplainsListPage({
    complainGroups, loadingPast, total, totalInPast, before, inboxOnly, complainsPastSliceLoad, complainsInboxSet
}: Props) {
    const {t} = useTranslation();

    const onLoadPast = () => complainsPastSliceLoad();

    const onInboxToggle = () => complainsInboxSet(!inboxOnly);

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
                            <FontAwesomeIcon icon="inbox"/>
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

const connector = connect(
    (state: ClientState) => ({
        complainGroups: getComplainGroups(state),
        loadingPast: state.complains.loadingPast,
        total: state.complains.total,
        totalInPast: state.complains.totalInPast,
        before: state.complains.before,
        inboxOnly: state.complains.inboxOnly
    }),
    { complainsPastSliceLoad, complainsInboxSet }
);

export default connector(ComplainsListPage);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createSelector } from 'reselect';

import { ClientState } from "state/state";
import { complainsPastSliceLoad } from "state/complains/actions";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import ComplainGroupLine from "ui/complains/ComplainGroupLine";
import ComplainsSentinel from "ui/complains/ComplainsSentinel";
import "./ComplainsPage.css";

type Props = ConnectedProps<typeof connector>;

const ComplainsPage = ({
    complainGroups, loadingFuture, total, totalInFuture, before, complainsPastSliceLoad
}: Props) => {
    const {t} = useTranslation();

    const onLoadPast = () => complainsPastSliceLoad();

    return (
        <>
            <PageHeader>
                <h2>{t("complains")}</h2>
            </PageHeader>
            <Page>
                <div className="complains">
                    <div className="navigator">{`${t("total-colon")} ${total}`}</div>
                    {complainGroups.map(group =>
                        group != null && <ComplainGroupLine key={group.id} group={group}/>
                    )}
                    <ComplainsSentinel loading={loadingFuture}
                                       title={
                                            complainGroups.length !== 0
                                                ? t("view-previous-complains")
                                                : t("view-complains")
                                       } total={totalInFuture} visible={total > 0 && before < Number.MAX_SAFE_INTEGER}
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
        loadingFuture: state.complains.loadingFuture,
        total: state.complains.total,
        totalInFuture: state.complains.totalInFuture,
        before: state.complains.before
    }),
    { complainsPastSliceLoad }
);

export default connector(ComplainsPage);

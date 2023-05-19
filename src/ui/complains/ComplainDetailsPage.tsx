import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { complainsPastSliceLoad } from "state/complains/actions";
import { getActiveComplainGroup } from "state/complains/selectors";
import Jump from "ui/navigation/Jump";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";
import "./ComplainsListPage.css";

type Props = ConnectedProps<typeof connector>;

function ComplainsListPage({complainGroup}: Props) {
    const {t} = useTranslation();

    return (
        <>
            <PageHeader>
                <h2 className="ms-0">
                    <Jump href="/complains" className="btn btn-sm btn-outline-secondary">
                        {t("back-to-list-complains")}
                    </Jump>
                </h2>
            </PageHeader>
            <Page>
                <div className="complain content-panel">
                    {complainGroup?.id}
                </div>
            </Page>
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        complainGroup: getActiveComplainGroup(state)
    }),
    { complainsPastSliceLoad }
);

export default connector(ComplainsListPage);

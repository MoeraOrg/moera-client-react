import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Loading } from "ui/control";
import { Page } from "ui/page/Page";
import PageHeader from "ui/page/PageHeader";

type Props = ConnectedProps<typeof connector>;

const ComplainsPage = ({}: Props) => {
    const {t} = useTranslation();

    return (
        <>
            <PageHeader>
                <h2>
                    {t("complains")} <Loading active={false}/>
                </h2>
            </PageHeader>
            <Page>
            </Page>
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
    })
);

export default connector(ComplainsPage);

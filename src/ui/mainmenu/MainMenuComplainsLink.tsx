import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { ClientState } from "state/state";
import { PAGE_COMPLAINS } from "state/navigation/pages";
import { getOwnerName } from "state/node/selectors";
import MainMenuLink from "ui/mainmenu/MainMenuLink";

type Props = ConnectedProps<typeof connector>;

function MainMenuComplainsLink({ownerName}: Props) {
    const {t} = useTranslation();

    if (ownerName !== SHERIFF_GOOGLE_PLAY_TIMELINE) {
        return null;
    }

    return <MainMenuLink page={PAGE_COMPLAINS} href="/complains">{t("complains")}</MainMenuLink>
}

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state)
    })
);

export default connector(MainMenuComplainsLink);

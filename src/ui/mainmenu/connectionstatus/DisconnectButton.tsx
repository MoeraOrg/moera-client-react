import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { confirmBox } from "state/confirmbox/actions";
import { disconnectFromHome } from "state/home/actions";
import { getHomeRootLocation } from "state/home/selectors";
import { Browser } from "ui/browser";

type Props = ConnectedProps<typeof connector>;

function DisconnectButton({location, login, confirmBox, disconnectFromHome}: Props) {
    const {t} = useTranslation();

    const onConfirmed = () => {
        if (location == null || login == null) {
            return;
        }
        Browser.deleteData(location);
        disconnectFromHome(location, login);
    };

    const onClick = () => confirmBox(t("want-disconnect"), t("disconnect"), t("cancel"), onConfirmed, null, "danger");

    return (
        <span className="connection-button" title={t("disconnect")} onClick={onClick}>
            <FontAwesomeIcon icon="sign-out-alt"/>
        </span>
    );
}

const connector = connect(
    (state: ClientState) => ({
        location: getHomeRootLocation(state),
        login: state.home.login
    }),
    { confirmBox, disconnectFromHome }
);

export default connector(DisconnectButton);

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { Storage } from "storage";
import { ClientState } from "state/state";
import { confirmBox } from "state/confirmbox/actions";
import { getHomeRootLocation } from "state/home/selectors";

export default function DisconnectButton() {
    const location = useSelector(getHomeRootLocation);
    const login = useSelector((state: ClientState) => state.home.login);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onConfirmed = () => {
        if (location == null || login == null) {
            return;
        }
        Storage.deleteData(location);
    };

    const onClick = () =>
        dispatch(confirmBox(t("want-disconnect"), t("disconnect"), t("cancel"), onConfirmed, null, "danger"));

    return (
        <span className="connection-button" title={t("disconnect")} onClick={onClick}>
            <FontAwesomeIcon icon="sign-out-alt"/>
        </span>
    );
}

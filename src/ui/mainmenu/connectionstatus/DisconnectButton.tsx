import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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
        dispatch(confirmBox({
            message: t("want-disconnect"),
            yes: t("disconnect"),
            no: t("cancel"),
            onYes: onConfirmed,
            variant: "danger"
        }));

    return (
        <span className="connection-button" title={t("disconnect")} onClick={onClick}>
            <FontAwesomeIcon icon={faSignOutAlt}/>
        </span>
    );
}

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { ClientState } from "state/state";
import { grantConfirm } from "state/grant/actions";
import { Button } from "ui/control";

export default function GrantConfirmation() {
    const {t} = useTranslation();

    const clientName = useSelector((state: ClientState) => state.grant.clientName);
    const scopes = useSelector((state: ClientState) => state.grant.scopes);
    const confirming = useSelector((state: ClientState) => state.grant.confirming);

    const dispatch = useDispatch();

    const onConfirm = () => dispatch(grantConfirm());

    return (
        <>
            <p>
                <b>{NodeName.shorten(clientName)}</b> {t("asking-access-permissions")}
            </p>
            <ul className="ms-3">
                {scopes.map(scope =>
                    <li key={scope}>{t(`scope.${scope}`)}</li>
                )}
            </ul>
            <p className="text-danger">{t("careful-grant-access")}</p>
            <Button variant="primary" className="submit-button" onClick={onConfirm} loading={confirming}>
                {t("confirm")}
            </Button>
        </>
    );
}

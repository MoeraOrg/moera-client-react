import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { settingsChangePasswordDialogOpen } from "state/settings/actions";
import { Button } from "ui/control";
import ChangePasswordDialog from "ui/settings/ChangePasswordDialog";

export default function SettingsItemPassword() {
    const showChangePasswordDialog = useSelector((state: ClientState) => state.settings.changePasswordDialogShow);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <>
            <Button variant="outline-primary" onClick={() => dispatch(settingsChangePasswordDialogOpen())}>
                {t("change-password-ellipsis")}
            </Button>
            {showChangePasswordDialog && <ChangePasswordDialog/>}
        </>
    );
}

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { settingsChangePasswordDialogOpen } from "state/settings/actions";
import { Button } from "ui/control";
import ChangePasswordDialog from "ui/settings/ChangePasswordDialog";

type Props = ConnectedProps<typeof connector>;

const SettingsItemPassword = ({showChangePasswordDialog, settingsChangePasswordDialogOpen}: Props) => {
    const {t} = useTranslation();

    return (
        <>
            <Button variant="outline-primary" onClick={() => settingsChangePasswordDialogOpen()}>
                {t("change-password-ellipsis")}
            </Button>
            {showChangePasswordDialog && <ChangePasswordDialog/>}
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        showChangePasswordDialog: state.settings.changePasswordDialogShow
    }),
    { settingsChangePasswordDialogOpen }
);

export default connector(SettingsItemPassword);

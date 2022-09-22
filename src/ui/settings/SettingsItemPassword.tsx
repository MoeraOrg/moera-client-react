import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { settingsChangePasswordDialogOpen } from "state/settings/actions";
import { Button } from "ui/control";
import ChangePasswordDialog from "ui/settings/ChangePasswordDialog";

type Props = ConnectedProps<typeof connector>;

const SettingsItemPassword = ({settingsChangePasswordDialogOpen}: Props) => {
    const {t} = useTranslation();

    return (
        <>
            <Button variant="outline-primary" onClick={() => settingsChangePasswordDialogOpen()}>
                {t("change-password-ellipsis")}
            </Button>
            <ChangePasswordDialog/>
        </>
    );
}

const connector = connect(
    null,
    { settingsChangePasswordDialogOpen }
);

export default connector(SettingsItemPassword);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { settingsChangePasswordDialogOpen } from "state/settings/actions";
import { Button } from "ui/control";
import ChangePasswordDialog from "ui/settings/ChangePasswordDialog";

type Props = ConnectedProps<typeof connector>;

const SettingsItemPassword = ({settingsChangePasswordDialogOpen}: Props) => (
    <>
        <Button variant="outline-primary" onClick={() => settingsChangePasswordDialogOpen()}>Change Password...</Button>
        <ChangePasswordDialog/>
    </>
);

const connector = connect(
    null,
    { settingsChangePasswordDialogOpen }
);

export default connector(SettingsItemPassword);

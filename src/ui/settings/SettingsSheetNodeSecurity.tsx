import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Button } from "ui/control";
import ChangePasswordDialog from "ui/settings/ChangePasswordDialog";
import { settingsChangePasswordDialogOpen } from "state/settings/actions";

type Props = ConnectedProps<typeof connector>;

const SettingsSheetNodeSecurity = ({settingsChangePasswordDialogOpen}: Props) => (
    <div className="settings-sheet">
        <Button variant="outline-primary" onClick={() => settingsChangePasswordDialogOpen()}>Change Password...</Button>
        <ChangePasswordDialog/>
    </div>
);

const connector = connect(
    null,
    { settingsChangePasswordDialogOpen }
);

export default connector(SettingsSheetNodeSecurity);

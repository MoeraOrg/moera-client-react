import React from 'react';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import ChangePasswordDialog from "ui/settings/ChangePasswordDialog";
import { settingsChangePasswordDialogOpen } from "state/settings/actions";

const SettingsSheetNodeSecurity = ({settingsChangePasswordDialogOpen}) => (
    <div className="settings-sheet">
        <Button variant="outline-primary" onClick={() => settingsChangePasswordDialogOpen()}>Change Password...</Button>
        <ChangePasswordDialog/>
    </div>
);

export default connect(
    null,
    { settingsChangePasswordDialogOpen }
)(SettingsSheetNodeSecurity);

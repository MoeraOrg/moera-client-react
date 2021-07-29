import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import ConnectForm from "ui/connectdialog/ConnectForm";
import AssignForm from "ui/connectdialog/AssignForm";
import ForgotForm from "ui/connectdialog/ForgotForm";
import ResetForm from "ui/connectdialog/ResetForm";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

const ConnectDialog = ({show, form}: Props) => (
    show ?
        <>
            {form === "connect" && <ConnectForm/>}
            {form === "assign" && <AssignForm/>}
            {form === "forgot" && <ForgotForm/>}
            {form === "reset" && <ResetForm/>}
        </>
    :
        null
);

const connector = connect(
    (state: ClientState) => ({
        show: state.connectDialog.show && !state.messageBox.show && !state.home.connecting,
        form: state.connectDialog.form
    })
);

export default connector(ConnectDialog);

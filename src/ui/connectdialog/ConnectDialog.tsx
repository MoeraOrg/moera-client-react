import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import ConnectForm from "ui/connectdialog/ConnectForm";
import AssignForm from "ui/connectdialog/AssignForm";
import ForgotForm from "ui/connectdialog/ForgotForm";
import ResetForm from "ui/connectdialog/ResetForm";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

const ConnectDialog = ({form}: Props) => (
    <>
        {form === "connect" && <ConnectForm/>}
        {form === "assign" && <AssignForm/>}
        {form === "forgot" && <ForgotForm/>}
        {form === "reset" && <ResetForm/>}
    </>
);

const connector = connect(
    (state: ClientState) => ({
        form: state.connectDialog.form
    })
);

export default connector(ConnectDialog);

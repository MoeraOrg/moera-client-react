import React from 'react';
import { connect } from 'react-redux';

import ConnectForm from "ui/connectdialog/ConnectForm";
import AssignForm from "ui/connectdialog/AssignForm";
import ForgotForm from "ui/connectdialog/ForgotForm";
import ResetForm from "ui/connectdialog/ResetForm";

const ConnectDialog = ({show, form}) => (
    show &&
        <>
            {form === "connect" && <ConnectForm/>}
            {form === "assign" && <AssignForm/>}
            {form === "forgot" && <ForgotForm/>}
            {form === "reset" && <ResetForm/>}
        </>
);

export default connect(
    state => ({
        show: state.connectDialog.show && !state.messageBox.show && !state.home.connecting,
        form: state.connectDialog.form
    })
)(ConnectDialog);

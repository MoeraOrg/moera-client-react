import React from 'react';
import { connect } from 'react-redux';

import ConnectForm from "ui/connectdialog/ConnectForm";
import AssignForm from "ui/connectdialog/AssignForm";
import ForgotForm from "ui/connectdialog/ForgotForm";
import ResetForm from "ui/connectdialog/ResetForm";

const ConnectDialog = ({show, form, messageBoxShow}) => (
    show && !messageBoxShow &&
        <>
            {form === "connect" && <ConnectForm/>}
            {form === "assign" && <AssignForm/>}
            {form === "forgot" && <ForgotForm/>}
            {form === "reset" && <ResetForm/>}
        </>
);

export default connect(
    state => ({
        show: state.connectDialog.show,
        form: state.connectDialog.form,
        messageBoxShow: state.messageBox.show
    })
)(ConnectDialog);

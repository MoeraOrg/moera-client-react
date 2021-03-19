import React from 'react';
import { connect } from 'react-redux';

import ConnectForm from "ui/connectdialog/ConnectForm";
import AssignForm from "ui/connectdialog/AssignForm";

const ConnectDialog = ({show, form}) => (
    show &&
        <>
            {form === "connect" && <ConnectForm/>}
            {form === "assign" && <AssignForm/>}
        </>
);

export default connect(
    state => ({
        show: state.connectDialog.show,
        form: state.connectDialog.form
    })
)(ConnectDialog);

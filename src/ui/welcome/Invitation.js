import React from 'react';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { isConnectedToHome } from "state/home/selectors";
import { openConnectDialog } from "state/connectdialog/actions";
import { openSignUpDialog } from "state/signupdialog/actions";
import "./Invitation.css";

const Invitation = ({connected, openConnectDialog, openSignUpDialog}) => (
    !connected &&
        <div id="invitation">
            <h1>Do you have a Moera blog?</h1>
            <div className="buttons">
                <Button variant="primary" size="lg" onClick={() => openSignUpDialog()}>Create a new blog</Button>
                <div className="or">or</div>
                <Button variant="success" size="lg" onClick={() => openConnectDialog()}>Connect to your blog</Button>
            </div>
        </div>
);

export default connect(
    state => ({
        connected: state.home.connecting || isConnectedToHome(state)
    }),
    { openConnectDialog, openSignUpDialog }
)(Invitation);

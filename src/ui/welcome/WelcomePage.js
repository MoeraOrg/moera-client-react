import React from 'react';

import { Page } from "ui/page/Page";
import WelcomeNavigator from "ui/welcome/WelcomeNavigator";
import Invitation from "ui/welcome/Invitation";
import "./WelcomePage.css";

const WelcomePage = () => (
    <Page className="welcome">
        <div className="title">Welcome!</div>
        <WelcomeNavigator/>
        <Invitation/>
    </Page>
);

export default WelcomePage;

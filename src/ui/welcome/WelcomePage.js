import React from 'react';

import { Page } from "ui/page/Page";
import WelcomeNavigator from "ui/welcome/WelcomeNavigator";
import "./WelcomePage.css";

const WelcomePage = () => (
    <Page className="welcome">
        <div className="title">Welcome!</div>
        <WelcomeNavigator/>
    </Page>
);

export default WelcomePage;

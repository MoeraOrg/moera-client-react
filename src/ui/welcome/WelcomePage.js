import React from 'react';

import { Page } from "ui/page/Page";
import WelcomeNavigator from "ui/welcome/WelcomeNavigator";
import Invitation from "ui/welcome/Invitation";
import "./WelcomePage.css";

const WelcomePage = () => (
    <Page className="welcome">
        <div className="title">Welcome!</div>
        <WelcomeNavigator/>
        <div className="discover">
            <a className="btn btn-primary btn-sm"
               href="https://lamed.moera.blog/moera/post/1549a6ef-2ea8-47ce-9643-abebc95e3d74">Find more people &rarr;</a>
        </div>
        <Invitation/>
    </Page>
);

export default WelcomePage;

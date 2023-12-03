import React from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from "ui/page/Page";
import WelcomeNavigator from "ui/welcome/WelcomeNavigator";
import Invitation from "ui/welcome/Invitation";
import Jump from "ui/navigation/Jump";
import "./WelcomePage.css";

export default function WelcomePage() {
    const {t} = useTranslation();

    return (
        <Page className="welcome">
            <div className="title">{t("welcome")}</div>
            <WelcomeNavigator/>
            <div className="discover">
                <Jump className="btn btn-primary btn-sm" nodeName="moera-activity-blog_0"
                      nodeUri="https://moera-activity-blog.moera.blog/moera"
                      href="/post/9f838e8f-d419-4c89-8908-06ae029d2482">
                    {t("find-more-people")}
                </Jump>
            </div>
            <Invitation/>
        </Page>
    );
}

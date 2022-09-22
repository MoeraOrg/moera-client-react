import React from 'react';
import { useTranslation } from 'react-i18next';

import { Page } from "ui/page/Page";
import WelcomeNavigator from "ui/welcome/WelcomeNavigator";
import Invitation from "ui/welcome/Invitation";
import Jump from "ui/navigation/Jump";
import "./WelcomePage.css";

const WelcomePage = () => {
    const {t} = useTranslation();

    return (
        <Page className="welcome">
            <div className="title">{t("welcome")}</div>
            <WelcomeNavigator/>
            <div className="discover">
                <Jump className="btn btn-primary btn-sm" nodeName="lamed_0" nodeUri="https://lamed.moera.blog/moera"
                      href="/post/1549a6ef-2ea8-47ce-9643-abebc95e3d74">
                    {t("find-more-people")}
                </Jump>
            </div>
            <Invitation/>
        </Page>
    );
}

export default WelcomePage;

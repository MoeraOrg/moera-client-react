import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from "react-i18next";

import { isConnectedToHome } from "state/home/selectors";
import { useIsTinyScreen } from "ui/hook";
import { Icon, msArrowBack } from "ui/material-symbols";
import { LogoImage } from "ui/mainmenu/logo/Logo";
import { useScrollShadow } from "ui/mainmenu/scroll-shadow";
import MobileBack from "ui/page/MobileBack";
import { useHomeNews } from "ui/feed/feeds";
import Jump from "ui/navigation/Jump";
import "./GlobalTitle.css";

interface Props {
    back?: string;
}

export default function GlobalTitle({back}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const newsHref = useHomeNews();
    const {shadow, sentinel} = useScrollShadow();
    const tinyScreen = useIsTinyScreen();
    const {t} = useTranslation();

    const backHref = back || (connectedToHome ? newsHref : null);

    console.log(back, connectedToHome, newsHref, backHref);

    if (tinyScreen) {
        if (backHref) {
            return <MobileBack className="global-back" href={backHref} sticky><LogoImage width="4.6rem"/></MobileBack>;
        } else {
            return (
                <>
                    <div id="global-title-sentinel" aria-hidden="true" ref={sentinel}/>
                    <header id="global-title" className={cx({"main-shadow": shadow})}>
                        <LogoImage width="4.6rem"/>
                    </header>
                </>
            );
        }
    } else {
        return (
            <>
                <header id="global-title" className={cx({"main-shadow": shadow})}>
                    <LogoImage width="4.6rem"/>
                </header>
                {backHref &&
                    <Jump href={backHref} id="global-title-back">
                        <Icon icon={msArrowBack} size={16}/>{t("back")}
                    </Jump>
                }
            </>
        );
    }
}

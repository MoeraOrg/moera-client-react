import React from 'react';
import cx from 'classnames';
import { useTranslation } from "react-i18next";

import { useIsTinyScreen } from "ui/hook";
import { Icon, msArrowBack } from "ui/material-symbols";
import { LogoImage } from "ui/mainmenu/logo/Logo";
import { useScrollShadow } from "ui/mainmenu/scroll-shadow";
import MobileBack from "ui/page/MobileBack";
import Jump from "ui/navigation/Jump";
import "./GlobalTitle.css";

interface Props {
    back?: string;
}

export default function GlobalTitle({back}: Props) {
    const {shadow, sentinel} = useScrollShadow();
    const tinyScreen = useIsTinyScreen();
    const {t} = useTranslation();

    if (tinyScreen) {
        if (back) {
            return <MobileBack className="global-back" href={back} sticky><LogoImage width="4.6rem"/></MobileBack>;
        } else {
            return (
                <>
                    <div id="global-title-sentinel" aria-hidden="true" ref={sentinel}/>
                    <header id="global-title" className={cx({shadow})}>
                        <LogoImage width="4.6rem"/>
                    </header>
                </>
            );
        }
    } else {
        return (
            <>
                <header id="global-title" className={cx({shadow})}>
                    <LogoImage width="4.6rem"/>
                </header>
                {back &&
                    <Jump href={back} id="global-title-back">
                        <Icon icon={msArrowBack} size={16}/>{t("back")}
                    </Jump>
                }
            </>
        );
    }
}

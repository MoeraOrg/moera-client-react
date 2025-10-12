import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { Page } from "ui/page/Page";
import MobileBack from "ui/page/MobileBack";
import { useOverlay } from "ui/overlays/overlays";
import { useHomeNews } from "ui/feed/feeds";
import DesktopMainMenu from "ui/mainmenu/DesktopMainMenu";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { useDisableScrollX } from "ui/settings/settings-hooks";
import SettingsConflicts from "ui/settings/SettingsConflicts";
import SettingsTabs from "ui/settings/SettingsTabs";
import SettingsBack from "ui/settings/SettingsBack";
import SettingsMenu from "ui/settings/SettingsMenu";
import SettingsTabContent from "ui/settings/SettingsTabContent";
import { REL_HOME } from "util/rel-node-name";
import { BUILD_NUMBER } from "build-number";
import "./SettingsPage.css";

type NotebookSide = "menu" | "sheet";

export default function SettingsPage() {
    const connectedToHome = useSelector(isConnectedToHome);
    const tab = useSelector((state: ClientState) => state.settings.tab);
    const newsHref = useHomeNews();
    const [side, setSide] = React.useState<NotebookSide>("menu");
    const switcherRef = useRef<HTMLDivElement>(null);
    useOverlay(
        switcherRef,
        {
            visible: side === "sheet",
            onClose: () => setSide("menu"),
            closeOnClick: false,
            closeOnSelect: false,
            closeOnEscape: false
        }
    )
    const {t} = useTranslation();

    // For an unknown reason, the scroll position may be non-zero after the page is loaded or tab switched
    useDisableScrollX(switcherRef);

    const visible = connectedToHome || tab === "client";

    return (
        <>
            <DesktopMainMenu/>
            <Page>
                <div className="page-left-pane">
                    <MainMenuSidebar/>
                </div>
                <div className="page-centralright-pane">
                    <SettingsConflicts/>
                    <div className="settings-notebook-switcher" ref={switcherRef}>
                        <div className={`settings-notebook ${side}-side`}>
                            <nav className="settings-left">
                                <div className="page-title only-desktop">{t("settings")}</div>
                                <MobileBack nodeName={REL_HOME} href={newsHref} className="settings-back" sticky>
                                    {t("settings")}
                                </MobileBack>
                                <SettingsTabs/>
                                {visible && <SettingsMenu onSelect={() => setSide("sheet")}/>}
                                <div id="build-number">rev {BUILD_NUMBER}</div>
                                <BottomMenu/>
                            </nav>
                            <main className="settings-right">
                                {visible &&
                                    <>
                                        <SettingsBack onBack={() => setSide("menu")}/>
                                        <SettingsTabContent tab={tab}/>
                                    </>
                                }
                            </main>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    );
}

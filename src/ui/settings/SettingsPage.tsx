import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { Page } from "ui/page/Page";
import { useOverlay } from "ui/overlays/overlays";
import MobileMainMenu from "ui/mainmenu/MobileMainMenu";
import MainMenuSidebar from "ui/mainmenu/MainMenuSidebar";
import BottomMenu from "ui/mainmenu/BottomMenu";
import { useDisableScrollX } from "ui/settings/settings-hooks";
import SettingsConflicts from "ui/settings/SettingsConflicts";
import SettingsTabs from "ui/settings/SettingsTabs";
import SettingsBack from "ui/settings/SettingsBack";
import SettingsMenu from "ui/settings/SettingsMenu";
import SettingsTabContent from "ui/settings/SettingsTabContent";
import "./SettingsPage.css";

type NotebookSide = "menu" | "sheet";

export default function SettingsPage() {
    const connectedToHome = useSelector(isConnectedToHome);
    const tab = useSelector((state: ClientState) => state.settings.tab);
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
            <Page>
                <div className="page-left-pane">
                    <MainMenuSidebar selected="settings"/>
                </div>
                <div className="page-centralright-pane">
                    <SettingsConflicts/>
                    <div className="settings-notebook-switcher" ref={switcherRef}>
                        <div className={`settings-notebook ${side}-side`}>
                            <div className="settings-left">
                                <div className="page-title only-desktop">{t("settings")}</div>
                                <MobileMainMenu/>
                                <SettingsTabs/>
                                {visible && <SettingsMenu onSelect={() => setSide("sheet")}/>}
                                <BottomMenu/>
                            </div>
                            <div className="settings-right">
                                {visible &&
                                    <>
                                        <SettingsBack onBack={() => setSide("menu")}/>
                                        <SettingsTabContent tab={tab}/>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    );
}

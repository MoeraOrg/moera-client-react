import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { settingsGoToSheet } from "state/settings/actions";
import { Tabs } from "ui/control";
import { msKeyboardArrowRight } from "ui/material-symbols";
import { useIsTinyScreen } from "ui/hook";
import { getActualSheetName, getActualTab, getSheets } from "ui/settings/settings-menu";
import "./SettingsMenu.css";

interface Props {
    onSelect: () => void;
}

export default function SettingsMenu({onSelect}: Props) {
    const tab = useSelector((state: ClientState) => getActualTab(state.settings.tab));
    const sheetName = useSelector((state: ClientState) => getActualSheetName(state.settings.tab, state.settings.sheet));
    const tinyScreen = useIsTinyScreen();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onChange = (name: string) => {
        dispatch(settingsGoToSheet(name));
        onSelect();
    };

    return (
        <>
            <div className="settings-menu-spacer"/>
            <Tabs<string>
                tabStyle="pills"
                className="flex-column settings-menu"
                arrow={msKeyboardArrowRight}
                tabs={
                    getSheets(tab).map(sh => ({
                        title: t(`setting.sheet.${sh.name}`),
                        value: sh.name,
                        href: `/settings/${tab}#${sh.name}`,
                        className: sh.navClass
                    }))
                }
                value={!tinyScreen ? sheetName : ""}
                onChange={onChange}
            />
        </>
    );
}

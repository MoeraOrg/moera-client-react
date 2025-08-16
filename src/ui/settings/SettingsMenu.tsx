import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { settingsGoToSheet } from "state/settings/actions";
import { Tabs } from "ui/control";
import { msKeyboardArrowRight } from "ui/material-symbols";
import { getActualSheetName, getActualTab, getSheets } from "ui/settings/settings-menu";
import "./SettingsMenu.css";

export default function SettingsMenu() {
    const tab = useSelector((state: ClientState) => getActualTab(state.settings.tab));
    const sheetName = useSelector((state: ClientState) => getActualSheetName(state.settings.tab, state.settings.sheet));
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
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
            value={sheetName}
            onChange={(name) => dispatch(settingsGoToSheet(name))}
        />
    );
}

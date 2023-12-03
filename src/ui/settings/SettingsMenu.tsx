import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { settingsGoToSheet } from "state/settings/actions";
import { getActualSheetName, getActualTab, getSheets } from "ui/settings/settings-menu";
import Jump from "ui/navigation/Jump";
import "./SettingsMenu.css";

export default function SettingsMenu() {
    const tab = useSelector((state: ClientState) => getActualTab(state.settings.tab));
    const sheetName = useSelector((state: ClientState) => getActualSheetName(state.settings.tab, state.settings.sheet));
    const dispatch = useDispatch();
    const {t} = useTranslation();

    return (
        <ul className="nav nav-pills flex-md-column col-md-2 settings-menu">{
            getSheets(tab).map(sh =>
                <li className="nav-item" key={sh.name}>
                    <span className={cx("nav-link", {"active": sh.name === sheetName})}
                          onClick={() => dispatch(settingsGoToSheet(sh.name))}>{
                        sh.name === sheetName ?
                            t(`setting.sheet.${sh.name}`)
                        :
                            <Jump href={`/settings/${tab}#${sh}`}>{t(`setting.sheet.${sh.name}`)}</Jump>
                    }</span>
                </li>
            )
        }</ul>
    );
}

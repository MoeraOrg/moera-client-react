import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import { settingsGoToSheet } from "state/settings/actions";
import { getActualSheet, getActualTab, getMenuItems } from "ui/settings/settings-menu";
import Jump from "ui/navigation/Jump";
import "./SettingsMenu.css";

type Props = ConnectedProps<typeof connector>;

function SettingsMenu({tab, sheet, settingsGoToSheet}: Props) {
    const items = getMenuItems(tab);
    return (
        <ul className="nav nav-pills flex-md-column col-md-2 settings-menu">{
            Object.keys(items).map(s =>
                <li className="nav-item" key={s}>
                    <span className={cx("nav-link", {"active": s === sheet})} onClick={() => settingsGoToSheet(s)}>{
                        s === sheet ?
                            items[s]
                        :
                            <Jump href={`/settings/${tab}#${s}`}>{items[s]}</Jump>
                    }</span>
                </li>
            )
        }</ul>
    );
}

const connector = connect(
    (state: ClientState) => ({
        tab: getActualTab(state.settings.tab),
        sheet: getActualSheet(state.settings.tab, state.settings.sheet)
    }),
    { settingsGoToSheet }
);

export default connector(SettingsMenu);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { SettingsTabId } from "state/settings/state";
import { Loading } from "ui/control";
import Jump from "ui/navigation/Jump";

type Props = {
    name: SettingsTabId;
    title: string;
    href: string;
    loading?: boolean;
} & ConnectedProps<typeof connector>;

const SettingsTab = ({name, title, href, loading, tab}: Props) => (
    <li className="nav-item">{
        tab === name ?
            <span className="nav-link active">{title} <Loading active={loading}/></span>
        :
            <Jump className="nav-link" href={href}>
                {title} <Loading active={loading}/>
            </Jump>
    }</li>
);

const connector = connect(
    (state: ClientState) => ({
        tab: state.settings.tab
    })
);

export default connector(SettingsTab);

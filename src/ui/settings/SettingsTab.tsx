import React from 'react';
import { useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { SettingsTabId } from "state/settings/state";
import { Loading } from "ui/control";
import Jump from "ui/navigation/Jump";

interface Props {
    name: SettingsTabId;
    title: string;
    href: string;
    loading?: boolean;
}

export default function SettingsTab({name, title, href, loading}: Props) {
    const tab = useSelector((state: ClientState) => state.settings.tab);

    return (
        <li className="nav-item">{
            tab === name ?
                <span className="nav-link active">{title} {loading && <Loading/>}</span>
            :
                <Jump className="nav-link" href={href}>
                    {title} {loading && <Loading/>}
                </Jump>
        }</li>
    );
}

import React from 'react';
import { connect } from 'react-redux';

import { Loading } from "ui/control";
import { settingsGoToTab } from "state/settings/actions";

const SettingsTab = ({name, title, href, loading, rootLocation, tab, settingsGoToTab}) => (
    <li className="nav-item">{
        tab === name ?
            <span className="nav-link active">{title} <Loading active={loading}/></span>
        :
            <a className="nav-link" href={rootLocation + href} onClick={e => {
                settingsGoToTab(name);
                e.preventDefault();
            }}>
                {title} <Loading active={loading}/>
            </a>
    }</li>
);

export default connect(
    state => ({
        rootLocation: state.node.root.location,
        tab: state.settings.tab
    }),
    { settingsGoToTab }
)(SettingsTab);

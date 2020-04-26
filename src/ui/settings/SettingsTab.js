import React from 'react';
import { connect } from 'react-redux';

import { Loading } from "ui/control";
import Jump from "ui/navigation/Jump";

const SettingsTab = ({name, title, href, loading, tab}) => (
    <li className="nav-item">{
        tab === name ?
            <span className="nav-link active">{title} <Loading active={loading}/></span>
        :
            <Jump className="nav-link" href={href}>
                {title} <Loading active={loading}/>
            </Jump>
    }</li>
);

export default connect(
    state => ({
        tab: state.settings.tab
    })
)(SettingsTab);

import React from 'react';
import { connect } from 'react-redux';

import { NodeName } from "api";
import "./HomeName.css";

const HomeName = ({ownerName}) => {
    const {name} = NodeName.parse(ownerName);
    if (name) {
        return <span className="navbar-text home-name">{name}</span>
    } else {
        return <span className="navbar-text home-name anonymous">no name set</span>
    }
};

export default connect(
    state => ({
        ownerName: state.home.owner.name
    })
)(HomeName);

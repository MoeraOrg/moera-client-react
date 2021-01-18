import React from 'react';
import { connect } from 'react-redux';

import { NodeName } from "api";
import "./HomeName.css";

const HomeName = ({ownerName, changing}) => {
    const {name, generation} = NodeName.parse(ownerName);
    if (name) {
        return (
            <span className="navbar-text home-name">
                {name}{generation ? <span className="generation">{generation}</span> : ""}
            </span>
        );
    } else {
        return <span className="navbar-text home-name anonymous">{changing ? "\u22ef" : "no name set"}</span>
    }
};

export default connect(
    state => ({
        ownerName: state.home.owner.name,
        changing: state.home.owner.changing
    })
)(HomeName);

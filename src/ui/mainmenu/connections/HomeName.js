import React from 'react';
import { connect } from 'react-redux';

import { NodeName } from "api";
import { Avatar } from "ui/control";
import "./HomeName.css";

function HomeName({ownerName, changing, avatar}) {
    const {name, generation} = NodeName.parse(ownerName);
    return (
        <span className="home-name">
            <Avatar avatar={avatar} size={32} nodeName=":"/>
            {name ?
                <span className="navbar-text name">
                    {name}{generation ? <span className="generation">{generation}</span> : ""}
                </span>
            :
                <span className="navbar-text name anonymous">{changing ? "\u22ef" : "no name set"}</span>
            }
        </span>
    );
}

export default connect(
    state => ({
        ownerName: state.home.owner.name,
        changing: state.home.owner.changing,
        avatar: state.home.owner.avatar
    })
)(HomeName);

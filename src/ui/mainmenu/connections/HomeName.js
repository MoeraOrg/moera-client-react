import React from 'react';
import { connect } from 'react-redux';

import { NodeName } from "api";
import { getHomeRootPage } from "state/home/selectors";
import { Avatar } from "ui/control";
import "./HomeName.css";

const HomeName = ({ownerName, changing, avatar, rootPage}) => {
    const {name, generation} = NodeName.parse(ownerName);
    return (
        <span className="home-name">
            <Avatar avatar={avatar} size={32} rootPage={rootPage}/>
            {name ?
                <span className="navbar-text name">
                    {name}{generation ? <span className="generation">{generation}</span> : ""}
                </span>
            :
                <span className="navbar-text name anonymous">{changing ? "\u22ef" : "no name set"}</span>
            }
        </span>
    );
};

export default connect(
    state => ({
        ownerName: state.home.owner.name,
        changing: state.home.owner.changing,
        avatar: state.home.owner.avatar,
        rootPage: getHomeRootPage(state)
    })
)(HomeName);

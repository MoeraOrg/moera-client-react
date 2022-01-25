import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { NodeName } from "api";
import { ClientState } from "state/state";
import "./HomeName.css";

type Props = ConnectedProps<typeof connector>;

function HomeName({ownerName, changing}: Props) {
    const {name, generation} = NodeName.parse(ownerName);
    return (
        <span className="home-name">
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

const connector = connect(
    (state: ClientState) => ({
        ownerName: state.home.owner.name,
        changing: state.home.owner.changing,
    })
);

export default connector(HomeName);

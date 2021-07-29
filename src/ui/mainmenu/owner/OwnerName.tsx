import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import NodeName from "ui/nodename/NodeName";
import "./OwnerName.css";

type Props = ConnectedProps<typeof connector>;

const OwnerName = ({name, changing, atHome, ...props}: Props) => (
    <>
        {atHome &&
            <span className="home navbar-text" title="You are at your home node"><FontAwesomeIcon icon="home"/></span>
        }
        {name ?
            <span id="owner-name"><NodeName name={name} linked={false} popup={false} {...props}/></span>
        :
            <span id="owner-name" className="navbar-text">{changing ? "\u22ef" : "no name set"}</span>
        }
    </>
);

const connector = connect(
    (state: ClientState) => ({
        ...state.owner,
        atHome: isAtHomeNode(state)
    })
);

export default connector(OwnerName);

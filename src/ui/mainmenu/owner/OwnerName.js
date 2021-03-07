import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isAtHomeNode } from "state/node/selectors";
import NodeName from "ui/nodename/NodeName";
import "./OwnerName.css";

const OwnerName = ({name, changing, atHome, ...props}) => (
    <>
        {atHome &&
            <span className="home navbar-text" title="You are at your home node"><FontAwesomeIcon icon="home"/></span>
        }
        <span id="owner-name">
            {name ?
                <NodeName name={name} linked={false} popup={false} {...props}/>
            :
                (changing ? "\u22ef" : "no name set")
            }
        </span>
    </>
);

OwnerName.propTypes = {
    name: PropType.string,
    verified: PropType.bool,
    correct: PropType.bool,
    changing: PropType.bool
};

export default connect(
    state => ({
        ...state.owner,
        atHome: isAtHomeNode(state)
    })
)(OwnerName);

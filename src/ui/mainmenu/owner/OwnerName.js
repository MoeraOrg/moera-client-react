import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isNodeAdmin } from "state/node/selectors";
import { isOwnerNameExpiring } from "state/owner/selectors";
import { NodeName } from "ui/control";
import "./OwnerName.css";

const OwnerName = ({onClick, name, expiring, ...props}) => (
    <span id="owner" className="navbar-text" onClick={onClick}>
        <span id="owner-name">{name ? <NodeName name={name} linked={false} {...props}/> : "no name set"}</span>
        {expiring &&
            <span className="owner-name-expiring" title="Need to prolong the name">
                <FontAwesomeIcon icon="exclamation-triangle"/>
            </span>
        }
    </span>
);

OwnerName.propTypes = {
    onClick: PropType.func,
    name: PropType.string,
    verified: PropType.bool,
    correct: PropType.bool,
    expiring: PropType.bool
};

export default connect(
    state => ({
        ...state.owner,
        expiring: isNodeAdmin(state) && isOwnerNameExpiring(state)
    })
)(OwnerName);

import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NodeName } from "api";
import { isHomeOwnerNameExpiring } from "state/home/selectors";
import "./HomeName.css";

const HomeName = ({ownerName, expiring}) => {
    const {name} = NodeName.parse(ownerName);
    if (name) {
        return (
            <>
                <span className="navbar-text home-name">{name}</span>
                {expiring &&
                    <span className="home-name-expiring" title="Need to prolong the name">
                        <FontAwesomeIcon icon="exclamation-triangle"/>
                    </span>
                }
            </>
        );
    } else {
        return <span className="navbar-text home-name anonymous">no name set</span>
    }
};

export default connect(
    state => ({
        ownerName: state.home.owner.name,
        expiring: isHomeOwnerNameExpiring(state)
    })
)(HomeName);

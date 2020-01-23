import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isOwnerNameExpired, isOwnerNameExpiring } from "state/owner/selectors";
import "./Expiration.css";

const Expiration = ({deadline, expiring, expired}) => {
    if (deadline == null) {
        return null;
    }
    const message = (!expired ? "Expiring at " : "Expired at ")
        + moment.unix(deadline).format("DD-MM-YYYY HH:mm:ss");
    return (
        <div className="expiration">
            {expiring && <FontAwesomeIcon icon="exclamation-triangle" className="expiring" />}
            {message}
        </div>
    );
};

export default connect(
    state => ({
        deadline: state.owner.deadline,
        expiring: isOwnerNameExpiring(state),
        expired: isOwnerNameExpired(state)
    })
)(Expiration);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { getInstantCount } from "state/feeds/selectors";
import "./InstantBell.css";

type Props = ConnectedProps<typeof connector>;

const InstantBell = ({count}: Props) => (
    <span className="connection-button bell-button" title="Notifications">
        <FontAwesomeIcon icon="bell"/>
        {count > 0 && <div className="count">{count}</div>}
    </span>
);

const connector = connect(
    (state: ClientState) => ({
        count: getInstantCount(state)
    })
);

export default connector(InstantBell);

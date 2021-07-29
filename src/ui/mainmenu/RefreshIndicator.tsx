import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import "./RefreshIndicator.css";

type Props = ConnectedProps<typeof connector>;

const RefreshIndicator = ({active}: Props) => (
    <div className={cx("refresh-indicator", {"active": active})}>
        <div className="body"/>
        <div className="tail"/>
    </div>
);

const connector = connect(
    (state: ClientState) => ({
        active: state.refresh.active
    })
);

export default connector(RefreshIndicator);

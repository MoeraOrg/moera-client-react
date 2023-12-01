import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import "./RefreshIndicator.css";

export default function RefreshIndicator() {
    const active = useSelector((state: ClientState) => state.refresh.active);

    return (
        <div className={cx("refresh-indicator", {"active": active})}>
            <div className="body"/>
            <div className="tail"/>
        </div>
    );
}

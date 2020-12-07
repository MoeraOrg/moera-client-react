import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import "./RefreshIndicator.css";

const RefreshIndicator = ({active}) => (
    <div className={cx("refresh-indicator", {"active": active})}>
        <div className="body"/>
        <div className="tail"/>
    </div>
);

export default connect(
    state => ({
        active: state.refresh.active
    })
)(RefreshIndicator);

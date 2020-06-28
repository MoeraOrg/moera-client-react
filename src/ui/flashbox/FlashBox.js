import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import "./FlashBox.css";

const FlashBox = ({show, dismissing, message}) => (
    show ?
        <div className={cx("flash-box", {"dismissing": dismissing})}>{message}</div>
    :
        null
);

export default connect(
    state => ({
        show: state.flashBox.show,
        dismissing: state.flashBox.dismissing,
        message: state.flashBox.message,
    })
)(FlashBox);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import "./FlashBox.css";

type Props = ConnectedProps<typeof connector>;

const FlashBox = ({show, dismissing, message}: Props) => (
    show ?
        <div className={cx("flash-box", {"dismissing": dismissing})}>{message}</div>
    :
        null
);

const connector = connect(
    (state: ClientState) => ({
        show: state.flashBox.show,
        dismissing: state.flashBox.dismissing,
        message: state.flashBox.message,
    })
);

export default connector(FlashBox);

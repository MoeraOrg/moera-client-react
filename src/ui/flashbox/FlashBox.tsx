import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import "./FlashBox.css";

export default function FlashBox() {
    const dismissing = useSelector((state: ClientState) => state.flashBox.dismissing);
    const message = useSelector((state: ClientState) => state.flashBox.message);

    return (
        <div className={cx("flash-box", {"dismissing": dismissing})}>{message}</div>
    );
}

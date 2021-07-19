import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import { errorDismiss } from "state/error/actions";
import "./ErrorPane.css";

type Props = ConnectedProps<typeof connector>;

function ErrorPane({message, messageVerbose, visible, errorDismiss}: Props) {
    useEffect(() => {
        if (visible && message) {
            console.error(messageVerbose);
        }
    }, [message, messageVerbose, visible]);

    return (
        <div className={
            cx(
                "alert",
                "alert-danger",
                "error-pane", {
                    "error-pane-visible": visible,
                    "error-pane-hidden": !visible
                }
            )
        }>
            {message}
            <button type="button" className="close" onClick={() => errorDismiss()}>&times;</button>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => state.error,
    { errorDismiss }
)

export default connector(ErrorPane);

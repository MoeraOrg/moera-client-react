import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import { ErrorState } from "state/error/state";
import { errorDismiss } from "state/error/actions";
import "./ErrorPane.css";

type Props = ErrorState & {
    errorDismiss: typeof errorDismiss;
}

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

export default connect(
    (state: ClientState) => state.error,
    { errorDismiss }
)(ErrorPane);

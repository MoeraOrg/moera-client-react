import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import { errorDismiss } from "state/error/actions";
import { CloseButton } from "ui/control";
import "./ErrorPane.css";

type Props = ConnectedProps<typeof connector>;

function ErrorPane({message, messageVerbose, visible, errorDismiss}: Props) {
    useEffect(() => {
        if (visible && message) {
            console.error(messageVerbose);
        }
    }, [message, messageVerbose, visible]);

    const [expanded, setExpanded] = useState<boolean>(false);

    const onClick = () => setExpanded(!expanded);

    return (
        <div className={
            cx(
                "alert",
                "alert-danger",
                "alert-dismissible",
                "error-pane", {
                    "error-pane-visible": visible,
                    "error-pane-hidden": !visible
                }
            )
        } onClick={onClick}>
            {!expanded ?
                message
            :
                <>
                    {messageVerbose.split('\n').map((msg: string, index: number) =>
                        <React.Fragment key={index}>{msg}<br/></React.Fragment>
                    )}
                </>
            }
            <CloseButton onClick={() => errorDismiss()}/>
        </div>
    );
}

const connector = connect(
    (state: ClientState) => state.error,
    { errorDismiss }
)

export default connector(ErrorPane);

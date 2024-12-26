import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';

import { ClientState } from "state/state";
import { errorDismiss } from "state/error/actions";
import { CloseButton } from "ui/control";
import "./ErrorPane.css";

export default function ErrorPane() {
    const message = useSelector((state: ClientState) => state.error.message);
    const messageVerbose = useSelector((state: ClientState) => state.error.messageVerbose);
    const visible = useSelector((state: ClientState) => state.error.visible);
    const dispatch = useDispatch();

    useEffect(() => {
        if (visible && message) {
            console.error(messageVerbose);
        }
    }, [message, messageVerbose, visible]);

    const [expanded, setExpanded] = useState<boolean>(false);

    const onClick = (e: React.MouseEvent) => {
        if (!e.defaultPrevented) {
            setExpanded(!expanded);
        }
    }

    const onClose = (e: React.MouseEvent) => {
        dispatch(errorDismiss());
        e.preventDefault()
    }

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
            <CloseButton onClick={onClose}/>
        </div>
    );
}

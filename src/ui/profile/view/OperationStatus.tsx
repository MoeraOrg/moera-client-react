import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { format, fromUnixTime } from 'date-fns';
import cx from 'classnames';

import { ClientState } from "state/state";
import { Popover } from "ui/control";
import "./OperationStatus.css";

type Props = ConnectedProps<typeof connector>;

function OperationStatus({status, statusUpdated, errorCode, errorMessage}: Props) {
    let text;
    let success = false;
    let failure = false;
    switch (status) {
        case "waiting":
            text = "Operation is waiting";
            break;
        case "added":
            text = "Operation has been added";
            break;
        case "started":
            text = "Operation has been started";
            break;
        case "succeeded":
            text = "Operation succeeded";
            success = true;
            break;
        case "failed":
            text = "Operation failed";
            failure = true;
            break;
        case "unknown":
            text = "Operation status is unknown";
            break;
        default:
            return null;
    }
    const dateTime = statusUpdated ? " at " + format(fromUnixTime(statusUpdated), "dd-MM-yyyy HH:mm:ss") : "";
    return (
        <span className={cx(
            "naming-operation-status", {
                "success": success,
                "failure": failure
            }
            )}>
            {!failure && <>{text}</>}
            {failure &&
                <Popover text={text} textClassName="failure-reason">
                    Failure reason: {errorMessage ? errorMessage : errorCode}
                </Popover>
            }
            {dateTime}
        </span>
    );
}

const connector = connect(
    (state: ClientState) => ({
        status: state.nodeName.operationStatus,
        statusUpdated: state.nodeName.operationStatusUpdated,
        errorCode: state.nodeName.operationErrorCode,
        errorMessage: state.nodeName.operationErrorMessage,
    })
);

export default connector(OperationStatus);

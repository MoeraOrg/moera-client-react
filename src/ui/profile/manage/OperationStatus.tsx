import React from 'react';
import { useSelector } from 'react-redux';
import { addHours, format, formatISO, fromUnixTime, isAfter } from 'date-fns';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Popover } from "ui/control";
import "./OperationStatus.css";

export default function OperationStatus() {
    const status = useSelector((state: ClientState) => state.nodeName.operationStatus);
    const statusUpdated = useSelector((state: ClientState) => state.nodeName.operationStatusUpdated);
    const errorCode = useSelector((state: ClientState) => state.nodeName.operationErrorCode);
    const errorMessage = useSelector((state: ClientState) => state.nodeName.operationErrorMessage);
    const {t} = useTranslation();

    const recent = statusUpdated && isAfter(addHours(statusUpdated, 12), new Date());
    if (!recent) {
        return null;
    }

    const text = status != null ? t(`operation-status.${status}`) : undefined;
    const success = status === "succeeded";
    const failure = status === "failed";
    const date = fromUnixTime(statusUpdated);

    return (
        <div className={cx(
            "naming-operation-status", {
                "success": success,
                "failure": failure
            }
            )}>
            {!failure && <>{text}</>}
            {failure &&
                <Popover text={text} textClassName="failure-reason">
                    {t("failure-reason")}: {errorMessage || errorCode}
                </Popover>
            }
            {` ${t("operation-at")} `}<time dateTime={formatISO(date)}>{format(date, "dd-MM-yyyy HH:mm:ss")}</time>
        </div>
    );
}

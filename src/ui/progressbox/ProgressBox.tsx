import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { ClientState } from "state/state";
import { ModalDialog } from "ui/control";

type Props = ConnectedProps<typeof connector>;

function ProgressBox({show, done, total}: Props) {
    const {t} = useTranslation();

    if (!show) {
        return null;
    }

    const preparing = total <= 0;
    const width = !preparing ? done * 100.0 / total : 100;

    return (
        <ModalDialog risen>
            <div className="modal-body">
                <div className="text-center">{preparing ? t("preparing") : t("progress", {done, total})}</div>
                <div className={cx("progress", {"d-none": !preparing})}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                         style={{width: "100%"}}/>
                </div>
                <div className={cx("progress", {"d-none": preparing})}>
                    <div className="progress-bar" style={{width: `${width}%`}}/>
                </div>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => state.progressBox
);

export default connector(ProgressBox);

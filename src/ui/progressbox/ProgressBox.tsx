import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { ClientState } from "state/state";
import { ModalDialog } from "ui/control";

export default function ProgressBox() {
    const done = useSelector((state: ClientState) => state.progressBox.done);
    const total = useSelector((state: ClientState) => state.progressBox.total);
    const {t} = useTranslation();

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

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeEntryCopyTextDialog, entryCopyText, EntryCopyTextMode } from "state/entrycopytextdialog/actions";
import { ModalDialog } from "ui/control/ModalDialog";
import { Button } from "ui/control/Button";
import "./EntryCopyTextDialog.css";

export default function EntryCopyTextDialog() {
    const body = useSelector((state: ClientState) => state.entryCopyTextDialog.body);
    const nodeName = useSelector((state: ClientState) => state.entryCopyTextDialog.nodeName);
    const media = useSelector((state: ClientState) => state.entryCopyTextDialog.media);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onSubmit = (mode: EntryCopyTextMode) => () => {
        dispatch(closeEntryCopyTextDialog());
        if (body != null) {
            dispatch(entryCopyText(body, mode, nodeName, media));
        }
    }

    const onClose = () => dispatch(closeEntryCopyTextDialog());

    return (
        <ModalDialog title={t("copy-with-formatting")} className="entry-copy-text-dialog" onClose={onClose}>
            <div className="modal-body">
                {t("text-contains-formatting")}
            </div>
            <div className="modal-footer">
                <Button variant="warning" onClick={onSubmit("text")}>{t("text-only")}</Button>
                <Button variant="primary" onClick={onSubmit("html")}>{t("preserve-formatting")}</Button>
            </div>
        </ModalDialog>
    );
}

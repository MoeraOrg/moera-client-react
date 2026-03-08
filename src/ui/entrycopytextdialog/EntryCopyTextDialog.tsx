import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeEntryCopyTextDialog, entryCopyText, EntryCopyTextMode } from "state/entrycopytextdialog/actions";
import { useDispatcher } from "ui/hook";
import { Button, ModalDialog } from "ui/control";
import "./EntryCopyTextDialog.css";

export default function EntryCopyTextDialog() {
    const body = useSelector((state: ClientState) => state.entryCopyTextDialog.body);
    const nodeName = useSelector((state: ClientState) => state.entryCopyTextDialog.nodeName);
    const media = useSelector((state: ClientState) => state.entryCopyTextDialog.media);
    const dispatch = useDispatcher();
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
                <Button variant="secondary" onClick={onSubmit("text")}>{t("text-only")}</Button>
                <Button variant="primary" onClick={onSubmit("html")}>{t("preserve-formatting")}</Button>
            </div>
        </ModalDialog>
    );
}

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { closeEntryCopyTextDialog, entryCopyText, EntryCopyTextMode } from "state/entrycopytextdialog/actions";
import { ClientState } from "state/state";
import { ModalDialog } from "ui/control/ModalDialog";
import { Button } from "ui/control/Button";
import "./EntryCopyTextDialog.css";

type Props = ConnectedProps<typeof connector>;

function EntryCopyTextDialog({body, nodeName, media, closeEntryCopyTextDialog, entryCopyText}: Props) {
    const {t} = useTranslation();

    const onSubmit = (mode: EntryCopyTextMode) => () => {
        closeEntryCopyTextDialog();
        if (body != null) {
            entryCopyText(body, mode, nodeName, media);
        }
    }

    return (
        <ModalDialog title={t("copy-with-formatting")} className="entry-copy-text-dialog"
                     onClose={closeEntryCopyTextDialog}>
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

const connector = connect(
    (state: ClientState) => ({
        body: state.entryCopyTextDialog.body,
        nodeName: state.entryCopyTextDialog.nodeName,
        media: state.entryCopyTextDialog.media
    }),
    { closeEntryCopyTextDialog, entryCopyText }
);

export default connector(EntryCopyTextDialog);

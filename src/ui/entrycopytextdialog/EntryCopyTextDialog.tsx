import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { closeEntryCopyTextDialog, entryCopyText, EntryCopyTextMode } from "state/entrycopytextdialog/actions";
import { ClientState } from "state/state";
import { ModalDialog } from "ui/control/ModalDialog";
import { Button } from "ui/control/Button";
import "./EntryCopyTextDialog.css";

type Props = ConnectedProps<typeof connector>;

function EntryCopyTextDialog({show, body, nodeName, media, closeEntryCopyTextDialog, entryCopyText}: Props) {
    if (!show) {
        return null;
    }

    const onSubmit = (mode: EntryCopyTextMode) => () => {
        closeEntryCopyTextDialog();
        if (body != null) {
            entryCopyText(body, mode, nodeName, media);
        }
    }

    return (
        <ModalDialog title="Copy text with formatting" className="entry-copy-text-dialog"
                     onClose={closeEntryCopyTextDialog}>
            <div className="modal-body">
                The text contains formatting. Do you want to copy the text with formatting tags?
            </div>
            <div className="modal-footer">
                <Button variant="warning" onClick={onSubmit("text")}>Text only</Button>
                <Button variant="primary" onClick={onSubmit("html")}>Preserve formatting</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => ({
        show: state.entryCopyTextDialog.show,
        body: state.entryCopyTextDialog.body,
        nodeName: state.entryCopyTextDialog.nodeName,
        media: state.entryCopyTextDialog.media
    }),
    { closeEntryCopyTextDialog, entryCopyText }
);

export default connector(EntryCopyTextDialog);

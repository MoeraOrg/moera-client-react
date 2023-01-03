import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getFeedWidth } from "state/settings/selectors";
import { closeSourceDialog } from "state/sourcedialog/actions";
import { Button, Loading, ModalDialog } from "ui/control";
import "./SourceDialog.css";

type Props = ConnectedProps<typeof connector>;

function SourceDialog({show, text, loading, feedWidth, closeSourceDialog}: Props) {
    const {t} = useTranslation();

    if (!show) {
        return null;
    }

    return (
        <ModalDialog className="source-dialog" style={{"--feed-width": feedWidth + "px"}} title={t("view-source-title")}
                     onClose={closeSourceDialog}>
            <div className="modal-body">
                {loading ?
                    <Loading active/>
                :
                    <textarea className="form-control" value={text} onChange={() => {}}/>
                }
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={closeSourceDialog}>{t("close")}</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => ({
        show: state.sourceDialog.show,
        text: state.sourceDialog.text,
        loading: state.sourceDialog.loading,
        feedWidth: getFeedWidth(state)
    }),
    { closeSourceDialog }
);

export default connector(SourceDialog);

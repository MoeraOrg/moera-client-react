import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Button, Loading, ModalDialog } from "ui/control";
import { getSetting } from "state/settings/selectors";
import { closeSourceDialog } from "state/sourcedialog/actions";
import { ClientState } from "state/state";
import "./SourceDialog.css";

type Props = ConnectedProps<typeof connector>;

function SourceDialog({show, text, loading, feedWidth, closeSourceDialog}: Props) {
    if (!show) {
        return null;
    }

    return (
        <ModalDialog className="source-dialog" style={{"--feed-width": feedWidth + "px"}}
                     title="View Source" onClose={closeSourceDialog}>
            <div className="modal-body">
                {loading ?
                    <Loading active={true}/>
                :
                    <textarea className="form-control" value={text} onChange={() => {}}/>
                }
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={closeSourceDialog}>Close</Button>
            </div>
        </ModalDialog>
    );
}

const connector = connect(
    (state: ClientState) => ({
        show: state.sourceDialog.show,
        text: state.sourceDialog.text,
        loading: state.sourceDialog.loading,
        feedWidth: getSetting(state, "feed.width") as number
    }),
    { closeSourceDialog }
);

export default connector(SourceDialog);

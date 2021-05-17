import React from 'react';
import { connect } from 'react-redux';

import { Button, Loading, ModalDialog } from "ui/control";
import { getSetting } from "state/settings/selectors";
import { closeSourceDialog } from "state/sourcedialog/actions";
import "./SourceDialog.css";

function SourceDialog({show, text, loading, feedWidth, closeSourceDialog}) {
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

export default connect(
    state => ({
        show: state.sourceDialog.show,
        text: state.sourceDialog.text,
        loading: state.sourceDialog.loading,
        feedWidth: getSetting(state, "feed.width")
    }),
    { closeSourceDialog }
)(SourceDialog);

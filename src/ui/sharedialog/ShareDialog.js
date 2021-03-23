import React from 'react';
import { connect } from 'react-redux';

import { Button, ModalDialog } from "ui/control";
import { closeShareDialog, shareDialogCopyLink } from "state/sharedialog/actions";
import "./ShareDialog.css";

const ShareDialog = ({show, title, url, closeShareDialog, shareDialogCopyLink}) => (
    show &&
        <ModalDialog title="Share" className="share-dialog" onClose={closeShareDialog}>
            <div className="modal-body">
                <div className="title">"{title}"</div>
                <div className="link">
                    <input type="text" className="form-control" value={url}/>
                    <Button variant="secondary" onClick={() => shareDialogCopyLink(url)}>Copy</Button>
                </div>
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={closeShareDialog}>Close</Button>
            </div>
        </ModalDialog>
);

export default connect(
    state => ({
        show: state.shareDialog.show,
        title: state.shareDialog.title,
        url: state.shareDialog.url
    }),
    { closeShareDialog, shareDialogCopyLink }
)(ShareDialog);

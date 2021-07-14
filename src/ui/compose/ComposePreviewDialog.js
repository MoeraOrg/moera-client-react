import React from 'react';
import { connect } from 'react-redux';

import { Button, ModalDialog } from "ui/control";
import { composePreviewClose } from "state/compose/actions";
import { getComposeDraft } from "state/compose/selectors";
import { getSetting } from "state/settings/selectors";
import PostingOwner from "ui/posting/PostingOwner";
import PostingSubject from "ui/posting/PostingSubject";
import EntryHtml from "ui/posting/EntryHtml";
import "./ComposePreviewDialog.css";

class ComposePreviewDialog extends React.PureComponent {

    onClose = () => {
        const {composePreviewClose} = this.props;

        composePreviewClose();
    }

    render() {
        const {show, posting, feedWidth} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog className="compose-preview-dialog" style={{"--feed-width": feedWidth + "px"}}
                         title="Post Preview" onClose={this.onClose}>
                <div className="modal-body">
                    {posting &&
                        <div className="posting entry">
                            <div className="owner-line">
                                <PostingOwner posting={posting}/>
                            </div>
                            <PostingSubject posting={posting} preview={false}/>
                            <EntryHtml className="content" html={posting.body.text}/>
                        </div>
                    }
                </div>
                <div className="modal-footer">
                    <Button variant="primary" onClick={this.onClose}>Close</Button>
                </div>
            </ModalDialog>
        );
    }

}

export default connect(
    state => ({
        show: state.compose.showPreview,
        posting: getComposeDraft(state),
        feedWidth: getSetting(state, "feed.width")
    }),
    { composePreviewClose }
)(ComposePreviewDialog);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Button, ModalDialog } from "ui/control";
import { ClientState } from "state/state";
import { composePreviewClose } from "state/compose/actions";
import { getSetting } from "state/settings/selectors";
import DraftOwner from "ui/draft/DraftOwner";
import DraftSubject from "ui/draft/DraftSubject";
import EntryHtml from "ui/posting/EntryHtml";
import PostingGallery from "ui/posting/PostingGallery";
import "./ComposePreviewDialog.css";

type Props = ConnectedProps<typeof connector>;

class ComposePreviewDialog extends React.PureComponent<Props> {

    onClose = () => {
        const {composePreviewClose} = this.props;

        composePreviewClose();
    }

    render() {
        const {show, draft, feedWidth} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog className="compose-preview-dialog" style={{"--feed-width": feedWidth + "px"}}
                         title="Post Preview" onClose={this.onClose}>
                <div className="modal-body">
                    {draft &&
                        <div className="posting entry">
                            <div className="owner-line">
                                <DraftOwner draft={draft}/>
                            </div>
                            <DraftSubject draft={draft}/>
                            <EntryHtml className="content" html={draft.body.text} nodeName="" media={draft.media}/>
                            <PostingGallery nodeName="" media={draft.media ?? null}/>
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

const connector = connect(
    (state: ClientState) => ({
        show: state.compose.showPreview,
        draft: state.compose.draft ?? state.compose.posting,
        feedWidth: getSetting(state, "feed.width") as number
    }),
    { composePreviewClose }
);

export default connector(ComposePreviewDialog);

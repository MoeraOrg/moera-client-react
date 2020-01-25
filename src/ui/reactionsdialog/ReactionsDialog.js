import React from 'react';
import { connect } from 'react-redux';

import { closeReactionsDialog } from "state/reactionsdialog/actions";
import { ModalDialog } from "ui/control";
import ReactionsListView from "ui/reactionsdialog/ReactionsListView";
import "./ReactionsDialog.css";

class ReactionsDialog extends React.PureComponent {
    #itemsDom;

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (((!prevProps.show && this.props.show) || prevProps.activeTab !== this.props.activeTab) && this.#itemsDom) {
            this.#itemsDom.focus();
        }
    }

    render() {
        const {show, postingId, closeReactionsDialog} = this.props;

        if (!show) {
            return null;
        }

        return (
            <ModalDialog onClose={closeReactionsDialog}>
                <div className="reactions-dialog modal-body">
                    <ReactionsListView postingId={postingId} itemsRef={dom => {this.#itemsDom = dom}}/>
                </div>
            </ModalDialog>
        );
    }

}

export default connect(
    state => ({
        show: state.reactionsDialog.show,
        postingId: state.reactionsDialog.postingId
    }),
    { closeReactionsDialog }
)(ReactionsDialog);

import React from 'react';
import { connect } from 'react-redux';
import { connect as connectFormik } from 'formik';

import { Button } from "ui/control";
import composePageLogic from "ui/compose/compose-page-logic";
import { composeDraftRevisionDelete, composeDraftSelect } from "state/compose/actions";

function postingText(props) {
    return composePageLogic.mapValuesToPostingText(props.formik.values, props);
}

function isEmpty(postingText) {
    return composePageLogic.isPostingTextEmpty(postingText);
}

class ComposeResetButton extends React.PureComponent {

    onClick = () => {
        if (this.props.postingId == null) {
            this.props.composeDraftSelect(null);
        } else {
            this.props.composeDraftRevisionDelete();
        }
    };

    render() {
        const disabled = this.props.postingId == null
            ? isEmpty(postingText(this.props))
            : this.props.posting == null || !this.props.posting.draftPending;
        return (
            <Button variant="secondary" className="reset-button" type="button" disabled={disabled}
                    onClick={this.onClick}>
                RESET
            </Button>
        );
    }

}

export default connectFormik(
    connect(
        state => ({
            subjectPresent: state.compose.subjectPresent,
            postingId: state.compose.postingId,
            posting: state.compose.posting
        }),
        { composeDraftSelect, composeDraftRevisionDelete }
    )(ComposeResetButton)
);

import React from 'react';
import { connect } from 'react-redux';
import { connect as connectFormik } from 'formik';
import debounce from 'lodash.debounce';
import deepEqual from 'react-fast-compare';

import composePageLogic from "ui/compose/compose-page-logic";
import { composeDraftSave } from "state/compose/actions";

function postingText(props) {
    return composePageLogic.mapValuesToPostingText(props.formik.values, props);
}

function isEmpty(postingText) {
    return composePageLogic.isPostingTextEmpty(postingText);
}

class ComposeDraftSaver extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.state = {
            unsavedChanges: false
        };
    }

    onSave = debounce(() => {
        const {formik, postingId, draftId, composeDraftSave} = this.props;

        if (formik.status === "submitted") {
            return;
        }
        const thisText = postingText(this.props);
        if (isEmpty(thisText)) {
            return;
        }
        composeDraftSave(postingId, draftId, postingText(this.props));
        this.setState({unsavedChanges: false});
    }, 2000);

    componentWillUnmount() {
        this.onSave.cancel();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {postingId} = this.props;

        const prevText = postingText(prevProps);
        const thisText = postingText(this.props);
        if (!deepEqual(prevText, thisText) && (postingId == null || !isEmpty(prevText))) {
            this.setState({unsavedChanges: true});
            this.onSave();
        }
    }

    render() {
        const {savingDraft, savedDraft} = this.props;
        const {unsavedChanges} = this.state;

        if (!unsavedChanges) {
            return (
                <>
                    {savingDraft && "Saving..."}
                    {savedDraft && "Draft saved."}
                </>
            );
        }
        return null;
    }

}

export default connectFormik(
    connect(
        state => ({
            subjectPresent: state.compose.subjectPresent,
            postingId: state.compose.postingId,
            draftId: state.compose.draftId,
            savingDraft: state.compose.savingDraft,
            savedDraft: state.compose.savedDraft
        }),
        { composeDraftSave }
    )(ComposeDraftSaver)
);

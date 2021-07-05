import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import deepEqual from 'react-fast-compare';
import cloneDeep from 'lodash.clonedeep';

import composePageLogic from "ui/compose/compose-page-logic";
import { composeDraftSave } from "state/compose/actions";
import { getOwnerName } from "state/owner/selectors";
import "./ComposeDraftSaver.css";

function postingText(values, props) {
    return composePageLogic.mapValuesToPostingText(values, props);
}

function isEmpty(postingText) {
    return composePageLogic.isPostingTextEmpty(postingText);
}

function postingTextToDraftText(ownerName, postingId, draftId, postingText) {
    const draftText = cloneDeep(postingText);
    draftText.id = draftId;
    draftText.receiverName = ownerName;
    if (postingId == null) {
        draftText.draftType = "new-posting";
        draftText.receiverPostingId = null; // important, should not be undefined
    } else {
        draftText.draftType = "posting-update";
        draftText.receiverPostingId = postingId;
    }
    return draftText;
}

function ComposeDraftSaver(props) {
    const {initialPostingText, ownerName, postingId, draftId, savingDraft, savedDraft, composeDraftSave} = props;
    const [, setPrevText] = useState(initialPostingText);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const {status, values} = useFormikContext();

    const statusRef = useRef();
    statusRef.current = status;
    const valuesRef = useRef();
    valuesRef.current = values;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onSave = useCallback(debounce(() => {
        if (statusRef.current === "submitted") {
            return;
        }
        const thisText = postingText(valuesRef.current, props);
        if (isEmpty(thisText) || savingDraft) {
            return;
        }
        composeDraftSave(postingTextToDraftText(ownerName, postingId, draftId, thisText));
        setUnsavedChanges(false);
    }, 1500), [statusRef, valuesRef, props, setUnsavedChanges]);

    useEffect(() => {
        return () => {
            onSave.cancel();
        }
    }, [onSave]);

    useEffect(() => {
        setPrevText(prevText => {
            const thisText = postingText(values, props);
            if (!deepEqual(prevText, thisText) && !deepEqual(initialPostingText, thisText)) {
                setUnsavedChanges(true);
                if (!isEmpty(thisText)) {
                    onSave();
                }
            }
            return thisText;
        });
    }, [values, props, setPrevText, initialPostingText, setUnsavedChanges, onSave]);

    return (
        <div className="draft-saver">
            {!unsavedChanges && savingDraft && "Saving..."}
            {!unsavedChanges && savedDraft && "Draft saved."}
        </div>
    );
}

export default connect(
    state => ({
        ownerName: getOwnerName(state),
        subjectPresent: state.compose.subjectPresent,
        postingId: state.compose.postingId,
        draftId: state.compose.draftId,
        savingDraft: state.compose.savingDraft,
        savedDraft: state.compose.savedDraft
    }),
    { composeDraftSave }
)(ComposeDraftSaver);

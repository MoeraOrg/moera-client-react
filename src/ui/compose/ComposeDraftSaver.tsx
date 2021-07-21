import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useFormikContext } from 'formik';
import debounce from 'lodash.debounce';
import deepEqual from 'react-fast-compare';
import cloneDeep from 'lodash.clonedeep';

import composePageLogic, { ComposePageValues } from "ui/compose/compose-page-logic";
import { DraftText, PostingText } from "api/node/api-types";
import { composeDraftSave } from "state/compose/actions";
import { getOwnerName } from "state/owner/selectors";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import "./ComposeDraftSaver.css";

function postingText(values: ComposePageValues, props: Props): PostingText {
    return composePageLogic.mapValuesToPostingText(values, props);
}

function isEmpty(postingText: PostingText): boolean {
    return composePageLogic.isPostingTextEmpty(postingText);
}

function postingTextToDraftText(ownerName: string, postingId: string | null, postingText: PostingText): DraftText {
    return {
        ...cloneDeep(postingText),
        receiverName: ownerName,
        draftType: postingId == null ? "new-posting" : "posting-update",
        receiverPostingId: postingId == null ? null /* important, should not be undefined */ : postingId
    };
}

type Props = {
    initialPostingText: PostingText;
} & ConnectedProps<typeof connector>;

function ComposeDraftSaver(props: Props) {
    const {initialPostingText, postingId, draftId, savingDraft, savedDraft, composeDraftSave} = props;
    const [, setPrevText] = useState<PostingText>(initialPostingText);
    const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
    const {status, values} = useFormikContext<ComposePageValues>();

    const statusRef = useRef<string>();
    statusRef.current = status;
    const valuesRef = useRef<ComposePageValues>();
    valuesRef.current = values;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onSave = useCallback(debounce(() => {
        if (statusRef.current === "submitted" || valuesRef.current == null) {
            return;
        }
        const thisText = postingText(valuesRef.current, props);
        if (props.ownerName == null || isEmpty(thisText) || savingDraft) {
            return;
        }
        composeDraftSave(draftId, postingTextToDraftText(props.ownerName, postingId, thisText));
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

const connector = connect(
    (state: ClientState) => ({
        ownerName: getOwnerName(state),
        subjectPresent: state.compose.subjectPresent,
        postingId: state.compose.postingId,
        draftId: state.compose.draftId,
        savingDraft: state.compose.savingDraft,
        savedDraft: state.compose.savedDraft,
        smileysEnabled: getSetting(state, "posting.smileys.enabled") as boolean,
        newsFeedEnabled: getSetting(state, "posting.feed.news.enabled") as boolean,
        avatarShapeDefault: getSetting(state, "avatar.shape.default") as string
    }),
    { composeDraftSave }
);

export default connector(ComposeDraftSaver);

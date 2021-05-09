import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useField } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NodeName from "ui/nodename/NodeName";
import { getHomeOwnerName } from "state/home/selectors";

function ComposeFullName({ownerName, postingId, draftId}) {
    const [field, {value, initialValue}, {setValue}] = useField("fullName");
    const [edit, setEdit] = useState(false);

    const onEdit = useCallback(() => setEdit(true), [setEdit]);

    const onReset = useCallback(() => {
        setValue(initialValue);
        setEdit(false);
    }, [initialValue, setValue, setEdit]);

    const inputRef = useRef();
    useEffect(() => {
        if (edit && inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef, edit]);

    useEffect(() => {
        setEdit(false);
    }, [postingId, draftId, setEdit]);

    return (
        edit ?
            <div className="input-resettable">
                <input type="text" className="form-control col-6 col-md-4" {...field} maxLength={96} ref={inputRef}/>
                <button title="Reset to default" onClick={onReset}>
                    <FontAwesomeIcon icon="backspace"/>
                </button>
            </div>
        :
            <div className="text-editable" onClick={onEdit}>
                <NodeName name={ownerName} fullName={value} linked={false} popup={false}/>
            </div>
    );
}

export default connect(
    state => ({
        ownerName: getHomeOwnerName(state),
        postingId: state.compose.postingId,
        draftId: state.compose.draftId
    })
)(ComposeFullName);

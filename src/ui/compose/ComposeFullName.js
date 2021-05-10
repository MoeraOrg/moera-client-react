import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NodeName from "ui/nodename/NodeName";
import { getHomeOwnerName } from "state/home/selectors";
import useComposeTextEditable from "ui/compose/compose-text-editable";
import ComposeTextEditableIcon from "ui/compose/ComposeTextEditableIcon";

function ComposeFullName({ownerName, postingId, draftId}) {
    const {
        edit, field, value, inputRef, onEdit, onReset, onKeyDown
    } = useComposeTextEditable("fullName", postingId, draftId);

    return (
        edit ?
            <div className="input-resettable">
                <input type="text" className="form-control col-6 col-md-4" {...field} maxLength={96} ref={inputRef}
                       onKeyDown={onKeyDown}/>
                <button title="Reset to default" onClick={onReset}>
                    <FontAwesomeIcon icon="backspace"/>
                </button>
            </div>
        :
            <div className="text-editable" onClick={onEdit}>
                <NodeName name={ownerName} fullName={value} linked={false} popup={false}/>
                <ComposeTextEditableIcon/>
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

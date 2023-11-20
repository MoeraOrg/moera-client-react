import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import NodeName from "ui/nodename/NodeName";
import useComposeTextEditable from "ui/compose/compose-text-editable";
import ComposeTextEditableIcon from "ui/compose/ComposeTextEditableIcon";

export default function ComposeFullName() {
    const ownerName = useSelector(getHomeOwnerName);
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const draftId = useSelector((state: ClientState) => state.compose.draftId);
    const {
        edit, field, value, inputRef, onEdit, onReset, onKeyDown
    } = useComposeTextEditable<string, HTMLInputElement>("fullName", postingId, draftId);

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

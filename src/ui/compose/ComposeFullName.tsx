import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import NodeName from "ui/nodename/NodeName";
import useComposeTextEditable from "ui/compose/compose-text-editable";
import ComposeTextEditableIcon from "ui/compose/ComposeTextEditableIcon";

type Props = ConnectedProps<typeof connector>;

function ComposeFullName({ownerName, postingId, draftId}: Props) {
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

const connector = connect(
    (state: ClientState) => ({
        ownerName: getHomeOwnerName(state),
        postingId: state.compose.postingId,
        draftId: state.compose.draftId
    })
);

export default connector(ComposeFullName);

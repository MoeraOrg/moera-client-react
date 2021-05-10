import React from 'react';
import { connect } from 'react-redux';
import { DateTimePicker } from 'react-widgets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import cx from 'classnames';

import { getHomeOwnerName } from "state/home/selectors";
import useComposeTextEditable from "ui/compose/compose-text-editable";
import ComposeTextEditableIcon from "ui/compose/ComposeTextEditableIcon";

function ComposePublishAt({postingId, draftId}) {
    const {
        edit, field, value, setValue, onEdit, onReset, onKeyDown
    } = useComposeTextEditable("publishAt", postingId, draftId);

    return (
        edit ?
            <div className="input-resettable">
                <DateTimePicker name={field.name} value={value} valueFormat={{dateStyle: "short", timeStyle: "short"}}
                                includeTime={true} onChange={v => setValue(v)} onBlur={field.onBlur}
                                onKeyDown={onKeyDown} autoFocus={true}/>
                <button title="Reset to default" onClick={onReset}>
                    <FontAwesomeIcon icon="backspace"/>
                </button>
            </div>
        :
            <div className={cx("text-editable", {"disabled": postingId != null})}
                 onClick={postingId == null ? onEdit : null}>
                <span className="publish-at">{format(value, "dd-MM-yyyy HH:mm")}</span>
                {postingId == null && <ComposeTextEditableIcon/>}
            </div>
    );
}

export default connect(
    state => ({
        ownerName: getHomeOwnerName(state),
        postingId: state.compose.postingId,
        draftId: state.compose.draftId
    })
)(ComposePublishAt);

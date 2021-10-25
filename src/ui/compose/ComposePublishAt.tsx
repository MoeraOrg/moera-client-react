import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import cx from 'classnames';

import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import useComposeTextEditable from "ui/compose/compose-text-editable";
import ComposeTextEditableIcon from "ui/compose/ComposeTextEditableIcon";
import { Browser } from "ui/browser";

type Props = ConnectedProps<typeof connector>;

function ComposePublishAt({postingId, draftId}: Props) {
    const {
        edit, field, value, setValue, onEdit, onReset, onKeyDown
    } = useComposeTextEditable<Date>("publishAt", postingId, draftId);

    return (
        edit ?
            <div className="input-resettable">
                <DatePicker name={field.name}
                            selected={value}
                            onChange={v => {
                                if (v instanceof Date) {
                                    setValue(v);
                                }
                            }}
                            onBlur={field.onBlur}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="dd-MM-yyyy, HH:mm"
                            withPortal={Browser.isTinyScreen()}
                            onKeyDown={onKeyDown}
                            autoFocus/>
                <button title="Reset to default" onClick={onReset}>
                    <FontAwesomeIcon icon="backspace"/>
                </button>
            </div>
        :
            <div className={cx("text-editable", {"disabled": postingId != null})}
                 onClick={postingId == null ? onEdit : undefined}>
                <span className="publish-at">{format(value, "dd-MM-yyyy HH:mm")}</span>
                {postingId == null && <ComposeTextEditableIcon/>}
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

export default connector(ComposePublishAt);

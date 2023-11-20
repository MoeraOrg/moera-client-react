import React from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, formatISO } from 'date-fns';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import useComposeTextEditable from "ui/compose/compose-text-editable";
import ComposeTextEditableIcon from "ui/compose/ComposeTextEditableIcon";
import { Browser } from "ui/browser";

export default function ComposePublishAt() {
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const draftId = useSelector((state: ClientState) => state.compose.draftId);

    const {
        edit, field, value, setValue, onEdit, onReset, onKeyDown
    } = useComposeTextEditable<Date, HTMLDivElement>("publishAt", postingId, draftId);

    const {t} = useTranslation();

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
                <button title={t("reset-to-default")} onClick={onReset}>
                    <FontAwesomeIcon icon="backspace"/>
                </button>
            </div>
        :
            <div className={cx("text-editable", {"disabled": postingId != null})}
                 onClick={postingId == null ? onEdit : undefined}>
                <time className="publish-at" dateTime={formatISO(value)}>{format(value, "dd-MM-yyyy HH:mm")}</time>
                {postingId == null && <ComposeTextEditableIcon/>}
            </div>
    );
}

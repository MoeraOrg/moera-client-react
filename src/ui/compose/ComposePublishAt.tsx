import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';
import { format, formatISO } from 'date-fns';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Loading } from "ui/control";
import useComposeTextEditable from "ui/compose/compose-text-editable";
import ComposeTextEditableIcon from "ui/compose/ComposeTextEditableIcon";
import { useIsTinyScreen } from "ui/hook/media-query";

const DatePicker = React.lazy(() => import('react-datepicker'));

export default function ComposePublishAt() {
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const draftId = useSelector((state: ClientState) => state.compose.draftId);
    const tinyScreen = useIsTinyScreen();

    const {
        edit, field, value, setValue, onEdit, onReset, onKeyDown
    } = useComposeTextEditable<Date, HTMLDivElement>("publishAt", postingId, draftId);

    const {t} = useTranslation();

    return (
        edit ?
            <div className="input-resettable">
                <Suspense fallback={<Loading/>}>
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
                                withPortal={tinyScreen}
                                onKeyDown={onKeyDown}
                                autoFocus/>
                    <button title={t("reset-to-default")} onClick={onReset}>
                        <FontAwesomeIcon icon={faBackspace}/>
                    </button>
                </Suspense>
            </div>
        :
            <div className={cx("text-editable", {"disabled": postingId != null})}
                 onClick={postingId == null ? onEdit : undefined}>
                <time className="publish-at" dateTime={formatISO(value)}>{format(value, "dd-MM-yyyy HH:mm")}</time>
                {postingId == null && <ComposeTextEditableIcon/>}
            </div>
    );
}

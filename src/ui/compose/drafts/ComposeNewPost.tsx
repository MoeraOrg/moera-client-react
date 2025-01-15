import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { composeDraftSelect } from "state/compose/actions";
import { getComposePostingId } from "state/compose/selectors";
import { Icon, msAddBox } from "ui/material-symbols";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import { areValuesEmpty, ComposePageValues } from "ui/compose/posting-compose";
import "./ComposeNewPost.css";

export default function ComposeNewPost() {
    const postingId = useSelector(getComposePostingId);
    const dispatch = useDispatch();
    const {values} = useFormikContext<ComposePageValues>();
    const {focus} = useRichTextEditorCommands();
    const {t} = useTranslation();

    const onClick = () => {
        dispatch(composeDraftSelect(null));
        focus();
    }

    if (postingId != null || areValuesEmpty(values)) {
        return null;
    }
    return (
        <div className="dropdown-item new-post" onClick={onClick}>
            <div>
                <Icon icon={msAddBox}/>
                {t("new-post-item")}
            </div>
        </div>
    );
}

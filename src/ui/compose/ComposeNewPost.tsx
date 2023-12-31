import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { composeDraftSelect } from "state/compose/actions";
import { getComposePostingId } from "state/compose/selectors";
import { areValuesEmpty, ComposePageValues } from "ui/compose/posting-compose";
import "./ComposeNewPost.css";

export default function ComposeNewPost() {
    const postingId = useSelector(getComposePostingId);
    const dispatch = useDispatch();
    const {values} = useFormikContext<ComposePageValues>();
    const {t} = useTranslation();

    const onClick = () => dispatch(composeDraftSelect(null));

    if (postingId != null || areValuesEmpty(values)) {
        return null;
    }
    return (
        <div className="dropdown-item new-post" onClick={onClick}>
            <FontAwesomeIcon icon={faPenAlt}/>
            &nbsp;&nbsp;{t("new-post-item")}
        </div>
    );
}

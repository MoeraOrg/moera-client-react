import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { composeDraftListItemDelete, composeUpdateDraftDelete } from "state/compose/actions";
import { confirmBox } from "state/confirmbox/actions";
import { Button } from "ui/control";
import "./ComposeResetButton.css";

export default function ComposeResetButton() {
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const draftId = useSelector((state: ClientState) => state.compose.draftId);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (draftId == null) {
        return null;
    }

    const onClick = () => {
        if (postingId == null) {
            dispatch(confirmBox(t("want-delete-draft"), t("yes"), t("no"), composeDraftListItemDelete(draftId, true)));
        } else {
            dispatch(confirmBox(t("want-forget-changes"), t("yes"), t("no"), composeUpdateDraftDelete(true)));
        }
    };

    if (postingId == null) {
        return (
            <Button variant="danger" className="reset-button" title={t("delete-draft")} onClick={onClick}>
                <FontAwesomeIcon icon="trash-can"/>
            </Button>
        );
    } else {
        return (
            <Button variant="info" className="reset-button" onClick={onClick}>
                <FontAwesomeIcon icon="undo-alt"/>
                {" " + t("undo")}
            </Button>
        );
    }
}

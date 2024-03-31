import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { composeDraftListItemDelete, composeUpdateDraftDelete } from "state/compose/actions";
import { isComposeReady } from "state/compose/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { Button } from "ui/control";
import "./ComposeResetButton.css";

export default function ComposeResetButton() {
    const ready = useSelector(isComposeReady);
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const draftId = useSelector((state: ClientState) => state.compose.draftId);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (draftId == null) {
        return null;
    }

    const onClick = () => {
        if (postingId == null) {
            dispatch(confirmBox({
                message: t("want-delete-draft"),
                yes: t("yes"),
                no: t("no"),
                onYes: composeDraftListItemDelete(draftId, true)
            }));
        } else {
            dispatch(confirmBox({
                message: t("want-forget-changes"),
                yes: t("yes"),
                no: t("no"),
                onYes: composeUpdateDraftDelete(true)
            }));
        }
    };

    if (postingId == null) {
        return (
            <Button variant="danger" className="reset-button" title={t("delete-draft")} disabled={!ready}
                    onClick={onClick}>
                <FontAwesomeIcon icon={faTrashCan}/>
            </Button>
        );
    } else {
        return (
            <Button variant="info" className="reset-button" disabled={!ready} onClick={onClick}>
                <FontAwesomeIcon icon={faUndoAlt}/>
                {" " + t("undo")}
            </Button>
        );
    }
}

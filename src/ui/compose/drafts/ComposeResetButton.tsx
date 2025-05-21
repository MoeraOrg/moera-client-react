import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { ClientAction } from "state/action";
import { composeDraftListItemDelete, composeUpdateDraftDelete } from "state/compose/actions";
import { isComposeReady } from "state/compose/selectors";
import { confirmBox } from "state/confirmbox/actions";
import { Icon, msDelete, msUndo } from "ui/material-symbols";
import { Button } from "ui/control";
import { useRichTextEditorCommands } from "ui/control/richtexteditor/rich-text-editor-commands-context";
import "./ComposeResetButton.css";

export default function ComposeResetButton() {
    const ready = useSelector(isComposeReady);
    const postingId = useSelector((state: ClientState) => state.compose.postingId);
    const draftId = useSelector((state: ClientState) => state.compose.draftId);
    const {focus} = useRichTextEditorCommands();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (draftId == null) {
        return null;
    }

    const focusAndSend = (action: ClientAction) => () => {
        focus();
        return action;
    }

    const onClick = () => {
        if (postingId == null) {
            dispatch(confirmBox({
                message: t("want-delete-draft"),
                yes: t("yes"),
                no: t("no"),
                onYes: focusAndSend(composeDraftListItemDelete(draftId, true)),
                onNo: () => focus()
            }));
        } else {
            dispatch(confirmBox({
                message: t("want-forget-changes"),
                yes: t("yes"),
                no: t("no"),
                onYes: focusAndSend(composeUpdateDraftDelete(true)),
                onNo: () => focus()
            }));
        }
    };

    if (postingId == null) {
        return (
            <Button variant="tool" className="reset-button" title={t("delete-draft")} disabled={!ready}
                    onClick={onClick}>
                <Icon icon={msDelete} size={20}/>
            </Button>
        );
    } else {
        return (
            <Button variant="tool" className="reset-button pe-3" disabled={!ready} onClick={onClick}>
                <Icon icon={msUndo} size={20}/>
                {" " + t("undo")}
            </Button>
        );
    }
}

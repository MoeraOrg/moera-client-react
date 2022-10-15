import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { Button } from "ui/control";
import { ClientState } from "state/state";
import { composeDraftListItemDelete, composeUpdateDraftDelete } from "state/compose/actions";
import { confirmBox } from "state/confirmbox/actions";
import "./ComposeResetButton.css";

type Props = ConnectedProps<typeof connector>;

function ComposeResetButton({postingId, draftId, confirmBox}: Props) {
    const {t} = useTranslation();

    if (draftId == null) {
        return null;
    }

    const onClick = () => {
        if (postingId == null) {
            confirmBox(t("want-delete-draft"), t("yes"), t("no"), composeDraftListItemDelete(draftId, true));
        } else {
            confirmBox(t("want-forget-changes"), t("yes"), t("no"), composeUpdateDraftDelete(true));
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

const connector = connect(
    (state: ClientState) => ({
        postingId: state.compose.postingId,
        draftId: state.compose.draftId
    }),
    { confirmBox }
);

export default connector(ComposeResetButton);

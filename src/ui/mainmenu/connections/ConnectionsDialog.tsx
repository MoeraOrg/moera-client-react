import React from 'react';

import { useTranslation } from 'react-i18next';

import { closeConnectionsDialog } from "state/home/actions";
import { useDispatcher } from "ui/hook";
import { ModalDialog } from "ui/control";
import Connections from "ui/mainmenu/connections/Connections";
import "./ConnectionsDialog.css";

export default function ConnectionsDialog() {
    const dispatch = useDispatcher();
    const {t} = useTranslation();

    const onClose = () => dispatch(closeConnectionsDialog());

    return (
        <ModalDialog title={t("switch-accounts")} className="connections-dialog" expand onClose={onClose}>
            <div className="modal-body">
                <Connections noActiveRoot/>
            </div>
        </ModalDialog>
    );
}

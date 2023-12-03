import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getFeedWidth } from "state/settings/selectors";
import { closeSourceDialog } from "state/sourcedialog/actions";
import { Button, Loading, ModalDialog } from "ui/control";
import "./SourceDialog.css";

export default function SourceDialog() {
    const text = useSelector((state: ClientState) => state.sourceDialog.text);
    const loading = useSelector((state: ClientState) => state.sourceDialog.loading);
    const feedWidth = useSelector(getFeedWidth);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(closeSourceDialog());

    return (
        <ModalDialog className="source-dialog" style={{"--feed-width": feedWidth + "px"}} title={t("view-source-title")}
                     onClose={onClose}>
            <div className="modal-body">
                {loading ?
                    <Loading/>
                :
                    <textarea className="form-control" value={text} onChange={() => {}}/>
                }
            </div>
            <div className="modal-footer">
                <Button variant="primary" onClick={onClose}>{t("close")}</Button>
            </div>
        </ModalDialog>
    );
}

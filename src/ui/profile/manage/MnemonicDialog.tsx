import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { mnemonicDelete, mnemonicDialogClose } from "state/nodename/actions";
import { Button, ModalDialog } from "ui/control";

interface ColumnProps {
    mnemonic: string[];
    start: number;
    end: number;
}

const Column = ({mnemonic, start, end}: ColumnProps) => (
    <div className="col-12 col-sm-4">
        <ol start={start + 1}>
            {mnemonic.slice(start, end).map((value, index) => (<li key={index}>{value}</li>))}
        </ol>
    </div>
);

export default function MnemonicDialog() {
    const name = useSelector((state: ClientState) => state.nodeName.mnemonicName);
    const mnemonic = useSelector((state: ClientState) => state.nodeName.mnemonic);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (!mnemonic) {
        return null;
    }

    const onCancel = () => dispatch(mnemonicDialogClose());

    const onConfirm = () => {
        dispatch(mnemonicDelete());
        dispatch(mnemonicDialogClose());
    }

    return (
        <ModalDialog title={t("named-key")} onClose={onCancel}>
            <div className="modal-body">
                <Trans i18nKey="write-down-words" values={{name}}>
                    <p/>
                    <p className="fw-bold"/>
                    <p/>
                </Trans>
                <p className="fs-5 fw-bold">{t("secret-words")}</p>
                <div className="row">
                    <Column mnemonic={mnemonic} start={0} end={8}/>
                    <Column mnemonic={mnemonic} start={8} end={16}/>
                    <Column mnemonic={mnemonic} start={16} end={24}/>
                </div>
            </div>
            <div className="modal-footer">
                <Button variant="secondary" onClick={onCancel}>{t("not-now")}</Button>
                <Button variant="primary" type="submit" onClick={onConfirm}>
                    {t("written-down-delete-words")}
                </Button>
            </div>
        </ModalDialog>
    );
}

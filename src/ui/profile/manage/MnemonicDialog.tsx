import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { mnemonicClose } from "state/nodename/actions";
import { Button, ModalDialog } from "ui/control";
import store from "state/store";

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

interface Values {
    confirmed: boolean;
}

type Props = FormikProps<Values>;

function MnemonicDialog({values: {confirmed}}: Props) {
    const name = useSelector((state: ClientState) => state.nodeName.mnemonicName);
    const mnemonic = useSelector((state: ClientState) => state.nodeName.mnemonic);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (!mnemonic) {
        return null;
    }

    return (
        <ModalDialog title={t("registered-name-secret")} onClose={() => dispatch(mnemonicClose())}>
            <Form>
                <div className="modal-body">
                    <p dangerouslySetInnerHTML={{__html: t("write-down-words", {name})}}/>
                    <div className="row">
                        <Column mnemonic={mnemonic} start={0} end={8}/>
                        <Column mnemonic={mnemonic} start={8} end={16}/>
                        <Column mnemonic={mnemonic} start={16} end={24}/>
                    </div>
                </div>
                <div className="modal-footer">
                    <Button variant="primary" type="submit">{t("close")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const mnemonicDialogLogic = {

    mapPropsToValues: (): Values => ({
        confirmed: false
    }),

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        store.dispatch(mnemonicClose());
        formik.setSubmitting(false);
    }

};

export default withFormik(mnemonicDialogLogic)(MnemonicDialog);

import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { mnemonicClose } from "state/nodename/actions";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField } from "ui/control/field";

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

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    confirmed: boolean;
}

type Props = OuterProps & FormikProps<Values>;

function MnemonicDialog({name, mnemonic, values: {confirmed}, resetForm}: Props) {
    const {t} = useTranslation();

    useEffect(() => resetForm(), [mnemonic, resetForm]);

    if (!mnemonic) {
        return null;
    }

    return (
        <ModalDialog title={t("registered-name-secret")}>
            <Form>
                <div className="modal-body">
                    <p dangerouslySetInnerHTML={{__html: t("write-down-words", {name})}}/>
                    <div className="row">
                        <Column mnemonic={mnemonic} start={0} end={8}/>
                        <Column mnemonic={mnemonic} start={8} end={16}/>
                        <Column mnemonic={mnemonic} start={16} end={24}/>
                    </div>
                    <CheckboxField name="confirmed" title={t("written-down-words")}/>
                </div>
                <div className="modal-footer">
                    <Button variant="primary" type="submit" disabled={!confirmed}>{t("close")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const mnemonicDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        confirmed: false
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.mnemonicClose();
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        name: state.nodeName.mnemonicName,
        mnemonic: state.nodeName.mnemonic,
    }),
    { mnemonicClose }
);

export default connector(withFormik(mnemonicDialogLogic)(MnemonicDialog));

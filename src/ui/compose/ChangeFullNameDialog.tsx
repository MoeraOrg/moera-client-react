import React from 'react';
import { Form, FormikBag, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";

interface Props {
    fullName: string;
    defaultFullName: string;
    onSubmit: (ok: boolean, fullName?: string) => void;
}

interface Values {
    fullName: string;
}

function ChangeFullNameDialog({fullName, defaultFullName, onSubmit}: Props) {
    const {t} = useTranslation();

    const onClose = () => onSubmit(false);

    return (
        <ModalDialog title={t("change-author-name")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <InputField name="fullName" title=" " initialValue={fullName} defaultValue={defaultFullName}
                                layout="follow-end" inputClassName="mt-2" anyValue autoFocus autoComplete="off"/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit">{t("change")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const changeFullNameDialogLogic = {

    mapPropsToValues: (props: Props): Values => ({
        fullName: props.fullName
    }),

    handleSubmit(values: Values, formik: FormikBag<Props, Values>): void {
        formik.props.onSubmit(true, values.fullName);
        formik.setSubmitting(false);
    }

};

export default withFormik(changeFullNameDialogLogic)(ChangeFullNameDialog);

import React, { useEffect } from 'react';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { FundraiserInfo } from "api";
import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";

interface OuterProps {
    fundraiser: FundraiserInfo | null;
    onSubmit: (value: FundraiserInfo) => void;
    onCancel: () => void;
    onDelete: () => void;
}

interface Values {
    title: string;
    qrCode: string;
    text: string;
    href: string;
}

type Props = OuterProps & FormikProps<Values>;

function FundraiserDialog(props: Props) {
    const {fundraiser, onCancel, onDelete, resetForm} = props;

    const {t} = useTranslation();

    useEffect(() => {
        resetForm({values: fundraiserDialogLogic.mapPropsToValues(props)});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 'props' are missing on purpose

    return (
        <ModalDialog title={fundraiser != null ? t("edit-donation") : t("add-donation")} onClose={onCancel}>
            <Form>
                <div className="modal-body">
                    <InputField name="title" title={t("title")} autoFocus errorsOnly/>
                    <InputField name="qrCode" title={t("qr-code")} errorsOnly/>
                    <InputField name="text" title={t("text")} errorsOnly/>
                    <InputField name="href" title={t("link")} errorsOnly/>
                </div>
                <div className="modal-footer">
                    {fundraiser != null &&
                        <Button variant="danger" className="me-auto" onClick={onDelete}>{t("delete")}</Button>
                    }
                    <Button variant="secondary" onClick={onCancel}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit">{t("ok")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const fundraiserDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        title: props.fundraiser?.title ?? "",
        qrCode: props.fundraiser?.qrCode ?? "",
        text: props.fundraiser?.text ?? "",
        href: props.fundraiser?.href ?? ""
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (!values.title.trim()) {
            errors.title = "must-not-empty";
        }

        return errors;
    },

    mapValuesToFundraiserInfo: (values: Values): FundraiserInfo => ({
        title: values.title,
        qrCode: values.qrCode || null,
        text: values.text || null,
        href: values.href || null
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.setStatus("submitted");
        formik.props.onSubmit(this.mapValuesToFundraiserInfo(values));
        formik.setSubmitting(false);
    }

};

export default withFormik(fundraiserDialogLogic)(FundraiserDialog);

import React, { useEffect } from 'react';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { FundraiserInfo } from "api/node/api-types";
import { Button, ModalDialog } from "ui/control";
import { InputField } from "ui/control/field";

interface Values {
    title: string;
    qrCode: string;
    text: string;
    href: string;
}

interface OuterProps {
    show: boolean;
    fundraiser: FundraiserInfo | null;
    onSubmit: (value: FundraiserInfo) => void;
    onCancel: () => void;
    onDelete: () => void;
}

type Props = OuterProps & FormikProps<Values>;

function FundraiserDialog(props: Props) {
    const {show, fundraiser, onCancel, onDelete, resetForm} = props;

    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: fundraiserDialogLogic.mapPropsToValues(props)});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]); // 'props' are missing on purpose

    if (!show) {
        return null;
    }

    return (
        <ModalDialog title={fundraiser != null ? t("edit-donation") : t("add-donation")} onClose={onCancel}>
            <Form>
                <div className="modal-body">
                    <InputField name="title" title={t("title")} autoFocus/>
                    <InputField name="qrCode" title={t("qr-code")}/>
                    <InputField name="text" title={t("text")}/>
                    <InputField name="href" title={t("link")}/>
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

    validationSchema: yup.object().shape({
        title: yup.string().trim().required("must-not-empty")
    }),

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

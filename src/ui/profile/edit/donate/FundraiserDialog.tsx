import React, { useEffect } from 'react';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';

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
        <ModalDialog title={fundraiser != null ? "Edit Donation" : "Add Donation"} onClose={onCancel}>
            <Form>
                <div className="modal-body">
                    <InputField name="title" title="Title" autoFocus/>
                    <InputField name="qrCode" title="QR Code"/>
                    <InputField name="text" title="Text"/>
                    <InputField name="href" title="Link"/>
                </div>
                <div className="modal-footer">
                    {fundraiser != null &&
                        <Button variant="danger" className="me-auto" onClick={onDelete}>Delete</Button>
                    }
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant="primary" type="submit">OK</Button>
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
        title: yup.string().trim().required("Must not be empty")
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

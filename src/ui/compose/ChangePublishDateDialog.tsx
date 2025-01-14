import React from 'react';
import { Form, FormikBag, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { Button, ModalDialog } from "ui/control";
import { DateTimeField } from "ui/control/field";

interface Props {
    publishAt: Date;
    defaultPublishAt: Date;
    onSubmit: (ok: boolean, publishAt?: Date) => void;
}

interface Values {
    publishAt: Date;
}

function ChangePublishDateDialog({publishAt, defaultPublishAt, onSubmit}: Props) {
    const {t} = useTranslation();

    const onClose = () => onSubmit(false);

    return (
        // shadowClick is false here, because DateTimeField dropdown is out of the dialog bounds
        <ModalDialog title={t("change-date-time")} onClose={onClose} shadowClick={false}>
            <Form>
                <div className="modal-body">
                    <DateTimeField name="publishAt" layout="right" inputClassName="me-2" initialValue={publishAt}
                                   defaultValue={defaultPublishAt}/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit">{t("change")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const changePublishDateDialogLogic = {

    mapPropsToValues: (props: Props): Values => ({
        publishAt: props.publishAt
    }),

    handleSubmit(values: Values, formik: FormikBag<Props, Values>): void {
        formik.props.onSubmit(true, values.publishAt);
        formik.setSubmitting(false);
    }

};

export default withFormik(changePublishDateDialogLogic)(ChangePublishDateDialog);

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, withFormik } from 'formik';
import * as yup from 'yup';
import { fromUnixTime, getUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeChangeDateDialog, storyChangeDate } from "state/changedatedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { DateTimeField } from "ui/control/field";
import store from "state/store";

interface OuterProps {
    storyId: string | null;
    publishedAt: number;
}

interface Values {
    publishedAt: Date;
}

function ChangeDateDialog() {
    const changing = useSelector((state: ClientState) => state.changeDateDialog.changing);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(closeChangeDateDialog());

    return (
        <ModalDialog title={t("change-date-time")} onClose={onClose} shadowClick={false}>
            <Form>
                <div className="modal-body">
                    <DateTimeField name="publishedAt"/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={changing}>{t("change")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const changeDateDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        publishedAt: fromUnixTime(props.publishedAt)
    }),

    validationSchema: yup.object().shape({
        publishedAt: yup.date()
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        if (formik.props.storyId != null) {
            store.dispatch(storyChangeDate(formik.props.storyId, getUnixTime(values.publishedAt)));
        }
        formik.setSubmitting(false);
    }

};

export default withFormik(changeDateDialogLogic)(ChangeDateDialog);

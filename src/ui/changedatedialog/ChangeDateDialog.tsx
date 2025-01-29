import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, withFormik } from 'formik';
import { fromUnixTime, getUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { closeChangeDateDialog, storyChangeDate } from "state/changedatedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { DateTimeField } from "ui/control/field";

interface OuterProps {
    storyId: string | null;
    publishedAt: number;
}

interface Values {
    publishedAt: Date;
}

function ChangeDateDialogInner() {
    const changing = useSelector((state: ClientState) => state.changeDateDialog.changing);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(closeChangeDateDialog());

    return (
        // shadowClick is false here, because DateTimeField dropdown is out of the dialog bounds
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

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        if (formik.props.storyId != null) {
            dispatch(storyChangeDate(formik.props.storyId, getUnixTime(values.publishedAt)));
        }
        formik.setSubmitting(false);
    }

};

const ChangeDateDialogOuter = withFormik(changeDateDialogLogic)(ChangeDateDialogInner);

export default function ChangeDateDialog() {
    const storyId = useSelector((state: ClientState) => state.changeDateDialog.storyId);
    const publishedAt = useSelector((state: ClientState) => state.changeDateDialog.publishedAt);

    return <ChangeDateDialogOuter storyId={storyId} publishedAt={publishedAt}/>;
}

import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { fromUnixTime, getUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeChangeDateDialog, storyChangeDate } from "state/changedatedialog/actions";
import { Button, ModalDialog } from "ui/control";
import { DateTimeField } from "ui/control/field";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    publishedAt: Date;
}

type Props = OuterProps & FormikProps<Values>;

function ChangeDateDialog(props: Props) {
    const {show, changing, publishedAt, closeChangeDateDialog} = props;
    const {t} = useTranslation();

    useEffect(() => {
        const values = changeDateDialogLogic.mapPropsToValues(props);
        props.resetForm({values});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publishedAt]); // 'props' are missing on purpose

    if (!show) {
        return null;
    }

    return (
        <ModalDialog title={t("change-date-time")} onClose={closeChangeDateDialog} shadowClick={false}>
            <Form>
                <div className="modal-body">
                    <DateTimeField name="publishedAt"/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={closeChangeDateDialog}>{t("cancel")}</Button>
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
            formik.props.storyChangeDate(formik.props.storyId, getUnixTime(values.publishedAt));
        }
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.changeDateDialog.show,
        storyId: state.changeDateDialog.storyId,
        publishedAt: state.changeDateDialog.publishedAt,
        changing: state.changeDateDialog.changing
    }),
    { closeChangeDateDialog, storyChangeDate }
);

export default connector(withFormik(changeDateDialogLogic)(ChangeDateDialog));

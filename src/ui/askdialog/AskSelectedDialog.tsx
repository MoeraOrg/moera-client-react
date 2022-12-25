import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { AskSubject } from "api/node/api-types";
import { ClientState } from "state/state";
import { closeAskDialog } from "state/askdialog/actions";
import { peopleSelectedAsk } from "state/people/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField, SelectField, SelectFieldChoice } from "ui/control/field";

interface Values {
    subject: string;
    message: string;
}

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function AskSelectedDialog(props: Props) {
    const {show, nodeName, nodeCount, sending, closeAskDialog, resetForm} = props;

    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: askSelectedDialogLogic.mapPropsToValues()});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]); // 'props' are missing on purpose

    if (!show || nodeName != null) {
        return null;
    }

    const subjects: SelectFieldChoice[] = [
        {title: "choose-request", value: "s:select"},
        {title: "subscribe-me", value: "s:subscribe"},
        {title: "add-me-friends", value: "s:friend"}
    ];

    return (
        <ModalDialog title={t("ask-count", {count: nodeCount})} onClose={closeAskDialog}>
            <Form>
                <div className="modal-body">
                    <SelectField name="subject" choices={subjects}/>
                    <InputField name="message" title={t("message")} maxLength={70} anyValue/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={closeAskDialog}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={sending}>{t("ask")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const askSelectedDialogLogic = {

    mapPropsToValues: (): Values => ({
        subject: "s:select",
        message: ""
    }),

    validationSchema: yup.object().shape({
        subject: yup.string().notOneOf(["s:select"], "need-to-choose")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.setStatus("submitted");
        formik.props.closeAskDialog();
        const subject: AskSubject = values.subject === "s:subscribe" ? "subscribe" : "friend";
        formik.props.peopleSelectedAsk(subject, values.message);
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.askDialog.show,
        nodeName: state.askDialog.nodeName,
        nodeCount: state.askDialog.nodeCount,
        sending: state.askDialog.sending
    }),
    { closeAskDialog, peopleSelectedAsk }
);

export default connector(withFormik(askSelectedDialogLogic)(AskSelectedDialog));

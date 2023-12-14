import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { AskSubject } from "api";
import { ClientState } from "state/state";
import { closeAskDialog } from "state/askdialog/actions";
import { peopleSelectedAsk } from "state/people/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField, SelectField, SelectFieldChoice } from "ui/control/field";
import store from "state/store";

const SUBJECTS: SelectFieldChoice[] = [
    {title: "choose-request", value: "s:select"},
    {title: "subscribe-me", value: "s:subscribe"},
    {title: "add-me-friends", value: "s:friend"}
];

interface Values {
    subject: string;
    message: string;
}

function AskSelectedDialog() {
    const nodeName = useSelector((state: ClientState) => state.askDialog.nodeName);
    const nodeCount = useSelector((state: ClientState) => state.askDialog.nodeCount);
    const sending = useSelector((state: ClientState) => state.askDialog.sending);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (nodeName != null) {
        return null;
    }

    const onClose = () => dispatch(closeAskDialog());

    return (
        <ModalDialog title={t("ask-count", {count: nodeCount})} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <SelectField name="subject" choices={SUBJECTS}/>
                    <InputField name="message" title={t("message")} maxLength={70} anyValue/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
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

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (values.subject === "s:select") {
            errors.subject = "need-to-choose";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        formik.setStatus("submitted");
        store.dispatch(closeAskDialog());
        const subject: AskSubject = values.subject === "s:subscribe" ? "subscribe" : "friend";
        store.dispatch(peopleSelectedAsk(subject, values.message));
        formik.setSubmitting(false);
    }

};

export default withFormik(askSelectedDialogLogic)(AskSelectedDialog);

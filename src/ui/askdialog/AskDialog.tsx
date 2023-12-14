import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikErrors, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getNodeCard } from "state/nodecards/selectors";
import { getSetting } from "state/settings/selectors";
import { askDialogSend, closeAskDialog } from "state/askdialog/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField, SelectField, SelectFieldChoice } from "ui/control/field";
import { NameDisplayMode } from "ui/types";
import { formatFullName } from "util/misc";
import store from "state/store";

interface OuterProps {
    nodeName: string | null;
}

interface Values {
    subject: string;
    message: string;
}

type Props = OuterProps & FormikProps<Values>;

function AskDialogInner({nodeName}: Props) {
    const card = useSelector((state: ClientState) => getNodeCard(state, state.askDialog.nodeName));
    const loading = useSelector((state: ClientState) => state.askDialog.loading);
    const allGroups = useSelector((state: ClientState) => state.askDialog.friendGroups);
    const subjectsAllowed = useSelector((state: ClientState) => state.askDialog.subjectsAllowed);
    const sending = useSelector((state: ClientState) => state.askDialog.sending);
    const nameDisplayMode = useSelector(
        (state: ClientState) => getSetting(state, "full-name.display")
    ) as NameDisplayMode;
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (nodeName == null) {
        return null;
    }

    const name = formatFullName(nodeName, card?.details.profile.fullName, nameDisplayMode);

    const subjects: SelectFieldChoice[] = [
        {title: "choose-request", value: "s:select"}
    ];

    if (card?.subscription.subscriber == null && subjectsAllowed.includes("subscribe")) {
        subjects.push({title: "subscribe-me", value: "s:subscribe"});
    }

    if (subjectsAllowed.includes("friend")) {
        const remoteGroups = card?.friendship.remoteGroups ?? [];
        for (const group of allGroups) {
            if (group.title != null && remoteGroups.find(g => g.id === group.id) == null) {
                subjects.push({
                    title: group.title === "t:friends"
                        ? "add-me-friends"
                        : ["add-me-friend-group", {group: group.title}],
                    value: group.id
                });
            }
        }
    }

    const onClose = () => dispatch(closeAskDialog());

    return (
        <ModalDialog title={t("ask-node", {name})} loading={loading} onClose={onClose}>
            {loading || subjects.length > 1 ?
                <Form>
                    <div className="modal-body">
                        <SelectField name="subject" choices={subjects}/>
                        <InputField name="message" title={t("message")} maxLength={70} anyValue/>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                        <Button variant="primary" type="submit" loading={sending}>{t("ask")}</Button>
                    </div>
                </Form>
            :
                <div className="modal-empty">{t("no-requests-available")}</div>
            }
        </ModalDialog>
    );
}

const askDialogLogic = {

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

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.setStatus("submitted");
        if (formik.props.nodeName != null) {
            if (values.subject === "s:subscribe") {
                store.dispatch(askDialogSend(formik.props.nodeName, "subscribe", null, values.message));
            } else {
                store.dispatch(askDialogSend(formik.props.nodeName, "friend", values.subject, values.message));
            }
        }
        formik.setSubmitting(false);
    }

};

const AskDialogOuter = withFormik(askDialogLogic)(AskDialogInner);

export default function AskDialog() {
    const nodeName = useSelector((state: ClientState) => state.askDialog.nodeName);

    return <AskDialogOuter nodeName={nodeName}/>
}

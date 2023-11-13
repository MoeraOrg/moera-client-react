import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getNodeCard } from "state/nodecards/selectors";
import { getSetting } from "state/settings/selectors";
import { askDialogSend, closeAskDialog } from "state/askdialog/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField, SelectField, SelectFieldChoice } from "ui/control/field";
import { NameDisplayMode } from "ui/types";
import { formatFullName } from "util/misc";

interface Values {
    subject: string;
    message: string;
}

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function AskDialog(props: Props) {
    const {
        nodeName, card, loading, allGroups, subjectsAllowed, sending, nameDisplayMode, closeAskDialog, resetForm
    } = props;

    const {t} = useTranslation();

    useEffect(() => {
        resetForm({values: askDialogLogic.mapPropsToValues()});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 'props' are missing on purpose

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

    return (
        <ModalDialog title={t("ask-node", {name})} loading={loading} onClose={closeAskDialog}>
            {loading || subjects.length > 1 ?
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

    validationSchema: yup.object().shape({
        subject: yup.string().notOneOf(["s:select"], "need-to-choose")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.setStatus("submitted");
        if (formik.props.nodeName != null) {
            if (values.subject === "s:subscribe") {
                formik.props.askDialogSend(formik.props.nodeName, "subscribe", null, values.message);
            } else {
                formik.props.askDialogSend(formik.props.nodeName, "friend", values.subject, values.message);
            }
        }
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        nodeName: state.askDialog.nodeName,
        card: getNodeCard(state, state.askDialog.nodeName),
        loading: state.askDialog.loading,
        allGroups: state.askDialog.friendGroups,
        subjectsAllowed: state.askDialog.subjectsAllowed,
        sending: state.askDialog.sending,
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    }),
    { closeAskDialog, askDialogSend }
);

export default connector(withFormik(askDialogLogic)(AskDialog));

import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { NodeName } from "api";
import { SheriffOrderReason } from "api/node/api-types";
import { ClientState } from "state/state";
import { closeSheriffOrderDialog, sheriffOrderDialogSubmit } from "state/sherifforderdialog/actions";
import { Button, ModalDialog } from "ui/control";
import { RichTextField, SelectField, SelectFieldChoice } from "ui/control/field";

const REASON_CODES: SelectFieldChoice[] = [
    {title: "sheriff-order-reason.unknown", value: "unknown"},
    {title: "sheriff-order-reason.unlawful", value: "unlawful"},
    {title: "sheriff-order-reason.defamatory", value: "defamatory"},
    {title: "sheriff-order-reason.threat", value: "threat"},
    {title: "sheriff-order-reason.spam", value: "spam"},
    {title: "sheriff-order-reason.scam", value: "scam"},
    {title: "sheriff-order-reason.malware", value: "malware"},
    {title: "sheriff-order-reason.copyright", value: "copyright"},
    {title: "sheriff-order-reason.impersonating", value: "impersonating"},
    {title: "sheriff-order-reason.privacy", value: "privacy"}
];

interface Values {
    reasonCode: SheriffOrderReason;
    reasonDetails: string;
}

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function SheriffOrderDialog(props: Props) {
    const {
        show, nodeName, fullName, postingId, commentId, heading, submitting, closeSheriffOrderDialog, resetForm
    } = props;

    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: sheriffOrderDialogLogic.mapPropsToValues()});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]); // 'props' are missing on purpose

    if (!show) {
        return null;
    }

    let messageKey: string;
    let messageValues;
    if (postingId == null) {
        messageKey = "hide-blog-google-play";
        messageValues = {name: fullName || NodeName.shorten(nodeName)};
    } else if (commentId == null) {
        messageKey = "hide-post-google-play";
        messageValues = {heading};
    } else {
        messageKey = "hide-comment-google-play";
        messageValues = {heading};
    }

    return (
        <ModalDialog title={t("sheriff-order")} onClose={closeSheriffOrderDialog}>
            <Form>
                <div className="modal-body">
                    <p>
                        <Trans i18nKey={messageKey} values={messageValues}>
                            <b/>
                        </Trans>
                    </p>
                    <SelectField name="reasonCode" title={t("reason")} choices={REASON_CODES} anyValue/>
                    <RichTextField name="reasonDetails" title={t("comment-title")} format="plain-text" smileysEnabled
                                   anyValue noMedia/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={closeSheriffOrderDialog}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={submitting}>{t("send")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const sheriffOrderDialogLogic = {

    mapPropsToValues: (): Values => ({
        reasonCode: "unknown",
        reasonDetails: ""
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {nodeName, feedName, postingId, commentId, sheriffOrderDialogSubmit} = formik.props;

        formik.setStatus("submitted");
        sheriffOrderDialogSubmit(nodeName, feedName, postingId, commentId, values.reasonCode, values.reasonDetails);
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.sheriffOrderDialog.show,
        nodeName: state.sheriffOrderDialog.nodeName,
        fullName: state.sheriffOrderDialog.fullName,
        feedName: state.sheriffOrderDialog.feedName,
        postingId: state.sheriffOrderDialog.postingId,
        commentId: state.sheriffOrderDialog.commentId,
        heading: state.sheriffOrderDialog.heading,
        submitting: state.sheriffOrderDialog.submitting
    }),
    { closeSheriffOrderDialog, sheriffOrderDialogSubmit }
);

export default connector(withFormik(sheriffOrderDialogLogic)(SheriffOrderDialog));

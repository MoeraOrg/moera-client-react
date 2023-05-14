import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { SheriffOrderReason } from "api/node/api-types";
import { ClientState } from "state/state";
import { closeSheriffOrderDialog, sheriffOrderDialogSubmit } from "state/sherifforderdialog/actions";
import { Button, ModalDialog, RichTextValue } from "ui/control";
import { RichTextField, SelectField, SelectFieldChoice } from "ui/control/field";
import { formatFullName } from "util/misc";
import { getSetting } from "state/settings/selectors";
import { NameDisplayMode } from "ui/types";
import { getHomeOwnerName } from "state/home/selectors";
import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";

const REASON_CODES: SelectFieldChoice[] = [
    {title: "sheriff-order-reason.other", value: "other"},
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
    reasonDetails: RichTextValue;
}

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function SheriffOrderDialog(props: Props) {
    const {
        show, target, submitting, isSheriff, nameDisplayMode, closeSheriffOrderDialog, resetForm
    } = props;

    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: sheriffOrderDialogLogic.mapPropsToValues()});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]); // 'props' are missing on purpose

    if (!show || target == null) {
        return null;
    }

    const title = isSheriff ? t("sheriff-order") : t("report-sheriff-title");

    let messageKey: string;
    let messageValues;
    if (target.postingId == null) {
        messageKey = isSheriff ? "hide-blog-google-play" : "i-think-blog-hide";
        messageValues = {name: formatFullName(target.nodeName, target.fullName, nameDisplayMode)};
    } else if (target.commentId == null) {
        messageKey = isSheriff ? "hide-post-google-play" : "i-think-post-hide";
        messageValues = {heading: target.postingHeading};
    } else {
        messageKey = isSheriff ? "hide-comment-google-play" : "i-think-comment-hide";
        messageValues = {heading: target.commentHeading};
    }

    return (
        <ModalDialog title={title} onClose={closeSheriffOrderDialog}>
            <Form>
                <div className="modal-body">
                    <p>
                        <Trans i18nKey={messageKey} values={messageValues}>
                            <b/>
                        </Trans>
                    </p>
                    <SelectField name="reasonCode" title={t("reason")} choices={REASON_CODES} anyValue/>
                    <RichTextField name="reasonDetails" title={t("comment-optional")} format="plain-text" smileysEnabled
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
        reasonCode: "other",
        reasonDetails: new RichTextValue("")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {target, sheriffOrderDialogSubmit} = formik.props;

        formik.setStatus("submitted");
        if (target != null) {
            sheriffOrderDialogSubmit(target, values.reasonCode, values.reasonDetails.text);
        }
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.sheriffOrderDialog.show,
        target: state.sheriffOrderDialog.target,
        submitting: state.sheriffOrderDialog.submitting,
        isSheriff: getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE,
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    }),
    { closeSheriffOrderDialog, sheriffOrderDialogSubmit }
);

export default connector(withFormik(sheriffOrderDialogLogic)(SheriffOrderDialog));

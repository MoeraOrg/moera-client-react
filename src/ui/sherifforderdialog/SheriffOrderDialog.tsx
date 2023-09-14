import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { SHERIFF_ORDER_REASON_CODES, SheriffOrderReason } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { closeSheriffOrderDialog, sheriffOrderDialogSubmit } from "state/sherifforderdialog/actions";
import { NameDisplayMode } from "ui/types";
import { Button, ModalDialog, RichTextValue } from "ui/control";
import { CheckboxField, RichTextField, SelectField, SelectFieldChoice } from "ui/control/field";
import { formatFullName } from "util/misc";

const REASON_CODES: SelectFieldChoice[] = SHERIFF_ORDER_REASON_CODES.map(code => ({
    title: `sheriff-order-reason.${code}`,
    value: code
}));

interface Values {
    reasonCode: SheriffOrderReason;
    reasonDetails: RichTextValue;
    anonymous: boolean;
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
                    <p dangerouslySetInnerHTML={{__html: t(messageKey, messageValues)}}/>
                    <SelectField name="reasonCode" title={t("reason")} choices={REASON_CODES} anyValue/>
                    <RichTextField name="reasonDetails" title={t("comment-optional")} format="plain-text" smileysEnabled
                                   anyValue noMedia/>
                    {!isSheriff &&
                        <div className="alert alert-warning">
                            <CheckboxField name="anonymous" title={t("not-publish-my-complain")} groupClassName="mb-0"
                                           anyValue/>
                            <span dangerouslySetInnerHTML={{__html: t("note-complains-public")}}/>
                        </div>
                    }
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
        reasonDetails: new RichTextValue(""),
        anonymous: false
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {target, sheriffOrderDialogSubmit} = formik.props;

        formik.setStatus("submitted");
        if (target != null) {
            sheriffOrderDialogSubmit(target, values.reasonCode, values.reasonDetails.text, values.anonymous);
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

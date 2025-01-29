import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { SHERIFF_GOOGLE_PLAY_TIMELINE } from "sheriffs";
import { SHERIFF_ORDER_REASON_CODES, SheriffOrderReason } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { closeSheriffOrderDialog, sheriffOrderDialogSubmit } from "state/sherifforderdialog/actions";
import { SheriffOrderTarget } from "state/sherifforderdialog/state";
import { NameDisplayMode } from "ui/types";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField, SelectField, SelectFieldChoice } from "ui/control/field";
import { RichTextField, RichTextValue } from "ui/control/richtexteditor";
import { formatFullName } from "util/names";

const REASON_CODES: SelectFieldChoice[] = SHERIFF_ORDER_REASON_CODES.map(code => ({
    title: `sheriff-order-reason.${code}`,
    value: code
}));

interface OuterProps {
    target: SheriffOrderTarget | null;
}

interface Values {
    reasonCode: SheriffOrderReason;
    reasonDetails: RichTextValue;
    anonymous: boolean;
}

type Props = OuterProps & FormikProps<Values>;

function SheriffOrderDialogInner({target}: Props) {
    const submitting = useSelector((state: ClientState) => state.sheriffOrderDialog.submitting);
    const isSheriff = useSelector((state: ClientState) => getHomeOwnerName(state) === SHERIFF_GOOGLE_PLAY_TIMELINE);
    const nameDisplayMode = useSelector((state: ClientState) =>
        getSetting(state, "full-name.display") as NameDisplayMode);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (target == null) {
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

    const onClose = () => dispatch(closeSheriffOrderDialog());

    return (
        <ModalDialog title={title} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <p dangerouslySetInnerHTML={{__html: t(messageKey, messageValues)}}/>
                    <SelectField name="reasonCode" title={t("reason")} choices={REASON_CODES} anyValue/>
                    <RichTextField
                        name="reasonDetails"
                        title={t("comment-optional")}
                        format="plain-text"
                        anyValue
                        noMedia
                        panelMode="bottom"
                    />
                    {!isSheriff &&
                        <div className="alert alert-warning">
                            <CheckboxField name="anonymous" title={t("not-publish-my-complaint")} groupClassName="mb-0"
                                           anyValue/>
                            <span dangerouslySetInnerHTML={{__html: t("note-complaints-public")}}/>
                        </div>
                    }
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={submitting}>{t("send")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const sheriffOrderDialogLogic = {

    mapPropsToValues: (): Values => ({
        reasonCode: "other",
        reasonDetails: new RichTextValue("", "plain-text"),
        anonymous: false
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {target} = formik.props;

        formik.setStatus("submitted");
        if (target != null) {
            dispatch(sheriffOrderDialogSubmit(
                target, values.reasonCode, values.reasonDetails.text, values.anonymous));
        }
        formik.setSubmitting(false);
    }

};

const SheriffOrderDialogOuter = withFormik(sheriffOrderDialogLogic)(SheriffOrderDialogInner);

export default function SheriffOrderDialog() {
    const target = useSelector((state: ClientState) => state.sheriffOrderDialog.target);

    return <SheriffOrderDialogOuter target={target}/>;
}

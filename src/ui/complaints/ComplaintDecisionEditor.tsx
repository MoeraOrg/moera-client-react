import React from 'react';
import { useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { SHERIFF_ORDER_REASON_CODES, SheriffComplaintDecisionText, SheriffOrderReason } from "api";
import { ClientState } from "state/state";
import { complaintsDecisionPost } from "state/complaints/actions";
import { ExtComplaintGroupInfo } from "state/complaints/state";
import { Button } from "ui/control";
import { CheckboxField, SelectField, SelectFieldChoice } from "ui/control/field";
import { RichTextValue, RichTextField } from "ui/control/richtexteditor";
import store from "state/store";
import "./ComplaintDecisionEditor.css";

type DecisionCode = "choose" | "reject" | SheriffOrderReason;

const DECISION_CODES: SelectFieldChoice[] = [
    {title: "choose-decision", value: "choose"},
    {title: "reject", value: "reject"},
].concat(SHERIFF_ORDER_REASON_CODES.map(code => ({
    title: `sheriff-order-reason.${code}`,
    value: code
})));

interface Values {
    decisionCode: DecisionCode;
    decisionDetails: RichTextValue;
    anonymous: boolean;
}

interface OuterProps {
    group: ExtComplaintGroupInfo | null;
}

type Props = OuterProps & FormikProps<Values>;

function ComplaintDecisionEditor({group, values}: Props) {
    const submitting = useSelector((state: ClientState) => state.complaints.submitting);
    const {t} = useTranslation();

    const submitEnabled = values.decisionCode !== "choose"
        && (values.decisionCode !== group?.decisionCode || values.decisionDetails.text !== group?.decisionDetails);

    return (
        <div className="complaint-decision-editor">
            <h4>{t("decision")}</h4>
            <Form>
                <SelectField name="decisionCode" choices={DECISION_CODES} anyValue/>
                <div className={cx({"d-none": values.decisionCode === "choose"})}>
                    <RichTextField name="decisionDetails" format="plain-text" anyValue noMedia/>
                    <CheckboxField name="anonymous" title={t("not-show-complaints")} anyValue/>
                </div>
                <Button variant="primary" type="submit" loading={submitting} disabled={!submitEnabled}
                        className={cx({"d-none": !submitEnabled})}>
                    {group?.decisionCode == null ? t("send") : t("update")}
                </Button>
            </Form>
        </div>
    );
}

const complaintDecisionEditorLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        decisionCode: props.group?.status === "rejected" ? "reject" : props.group?.decisionCode ?? "choose",
        decisionDetails: new RichTextValue(props.group?.decisionDetails ?? "", "plain-text"),
        anonymous: props.group?.anonymous ?? false
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const id = formik.props.group?.id;
        if (id == null || values.decisionCode === "choose") {
            formik.setSubmitting(false);
            return;
        }

        const decision: SheriffComplaintDecisionText = {
            reject: values.decisionCode === "reject",
            decisionCode: values.decisionCode === "reject" ? null : values.decisionCode,
            decisionDetails: values.decisionDetails.text,
            anonymous: values.anonymous
        }

        formik.setStatus("submitted");
        store.dispatch(complaintsDecisionPost(id, decision));
        formik.setSubmitting(false);
    }

};

export default withFormik(complaintDecisionEditorLogic)(ComplaintDecisionEditor);

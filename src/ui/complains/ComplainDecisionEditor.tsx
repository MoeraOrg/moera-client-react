import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { SheriffComplainDecisionText, SheriffOrderReason } from "api/node/api-types";
import { SHERIFF_ORDER_REASON_CODES } from "api/node/sheriff-order-reason-codes";
import { ClientState } from "state/state";
import { getActiveComplainGroup } from "state/complains/selectors";
import { Button, RichTextValue } from "ui/control";
import { RichTextField, SelectField, SelectFieldChoice } from "ui/control/field";
import "./ComplainDecisionEditor.css";
import { complainsDecisionPost } from "state/complains/actions";

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
}

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function ComplainDecisionEditor({group, submitting, values}: Props) {
    const {t} = useTranslation();

    const submitEnabled = values.decisionCode !== "choose"
        && (values.decisionCode !== group?.decisionCode || values.decisionDetails.text !== group?.decisionDetails);

    return (
        <div className="complain-decision-editor">
            <h4>{t("decision")}</h4>
            <Form>
                <SelectField name="decisionCode" choices={DECISION_CODES} anyValue/>
                <div className={cx({"d-none": values.decisionCode === "choose"})}>
                    <RichTextField name="decisionDetails" format="plain-text" smileysEnabled anyValue noMedia/>
                </div>
                <Button variant="primary" type="submit" loading={submitting} disabled={!submitEnabled}
                        className={cx({"d-none": !submitEnabled})}>
                    {group?.decisionCode == null ? t("send") : t("update")}
                </Button>
            </Form>
        </div>
    );
}

const complainDecisionEditorLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        decisionCode: props.group?.status === "rejected" ? "reject" : props.group?.decisionCode ?? "choose",
        decisionDetails: new RichTextValue(props.group?.decisionDetails ?? "")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const id = formik.props.group?.id;
        if (id == null || values.decisionCode === "choose") {
            formik.setSubmitting(false);
            return;
        }

        const decision: SheriffComplainDecisionText = {
            reject: values.decisionCode === "reject",
            decisionCode: values.decisionCode === "reject" ? null : values.decisionCode,
            decisionDetails: values.decisionDetails.text
        }

        formik.setStatus("submitted");
        formik.props.complainsDecisionPost(id, decision);
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        group: getActiveComplainGroup(state),
        submitting: state.complains.submitting
    }),
    { complainsDecisionPost }
);

export default connector(withFormik(complainDecisionEditorLogic)(ComplainDecisionEditor));

import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { add, getUnixTime } from 'date-fns';
import { Trans, useTranslation } from 'react-i18next';

import { BlockedOperation, BlockedUserInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeCard } from "state/nodecards/selectors";
import { getSetting } from "state/settings/selectors";
import { blockDialogSubmit, closeBlockDialog } from "state/blockdialog/actions";
import { NameDisplayMode } from "ui/types";
import { Button, ModalDialog, RichTextValue } from "ui/control";
import { CheckboxField, NumberField, RadioField, RichTextField } from "ui/control/field";
import { formatFullName } from "util/misc";
import "./BlockDialog.css";

type BlockingLevel = "none" | "ignore" | "comments" | "reactions" | "hide";

const BLOCKED_OPERATIONS: Record<BlockingLevel, BlockedOperation[]> = {
    "none": [],
    "ignore": ["instant", "visibility"],
    "comments": ["comment"],
    "reactions": ["comment", "reaction"],
    "hide": ["comment", "reaction", "instant", "visibility"]
}

function blockingLevel(operations: BlockedOperation[]): BlockingLevel {
    if (operations.length === 0) {
        return "none";
    }
    if (operations.includes("visibility")) {
        if (operations.includes("comment")) {
            return "hide";
        } else {
            return "ignore";
        }
    }
    if (operations.includes("reaction")) {
        return "reactions";
    } else {
        return "comments";
    }
}

interface Values {
    level: BlockingLevel;
    temporary: boolean;
    days: number;
    reasonOpen: boolean;
    reason: RichTextValue;
}

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function BlockDialog(props: Props) {
    const {show, nodeName, submitting, card, nameDisplayMode, closeBlockDialog, values, resetForm} = props;

    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: blockDialogLogic.mapPropsToValues(props)});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]); // 'props' are missing on purpose

    if (!show) {
        return null;
    }

    const name = formatFullName(nodeName, card?.details.profile.fullName, nameDisplayMode);

    const isChecked = (v: BlockingLevel) => (value: BlockingLevel) => value === v;

    return (
        <ModalDialog title={t("blocking-node", {name})} className="block-dialog" onClose={closeBlockDialog}>
            <Form>
                <div className="modal-body">
                    <RadioField<BlockingLevel> id="level-none" name="level" title={t("no-block")} groupClassName="mb-0"
                                               isChecked={isChecked("none")} value="none" anyValue autoFocus/>
                    <RadioField<BlockingLevel> id="level-ignore" name="level" title={t("hide")} groupClassName="mb-0"
                                               isChecked={isChecked("ignore")} value="ignore" anyValue/>
                    <RadioField<BlockingLevel> id="level-comments" name="level" title={t("deny-comments")}
                                               groupClassName="mb-0" isChecked={isChecked("comments")}
                                               value="comments" anyValue/>
                    <RadioField<BlockingLevel> id="level-reactions" name="level" title={t("deny-comments-reactions")}
                                               groupClassName="mb-0" isChecked={isChecked("reactions")}
                                               value="reactions" anyValue/>
                    <RadioField<BlockingLevel> id="level-hide" name="level" title={t("deny-everything-hide")}
                                               isChecked={isChecked("hide")} value="hide" anyValue/>
                    {values.level !== "none" &&
                        <>
                            <hr/>
                            <div className="unblock-days">
                                <CheckboxField name="temporary" groupClassName="mb-0"
                                               title={values.temporary ? undefined : t("unblock-after-time")} anyValue/>
                                {values.temporary &&
                                    <Trans i18nKey="unblock-after-days" values={{count: values.days}}>
                                        <NumberField name="days" horizontal min={1} max={1000}/>
                                    </Trans>
                                }
                            </div>
                            <details open={values.reasonOpen}>
                                <summary>{t("blocking-reason")}</summary>
                                <RichTextField name="reason" format="markdown" smileysEnabled anyValue noMedia/>
                            </details>
                        </>
                    }
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={closeBlockDialog}>{t("cancel")}</Button>
                    <Button variant={values.level !== "none" ? "danger" : "success"} type="submit" loading={submitting}>
                        {values.level !== "none" ? t("block") : t("unblock")}
                    </Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

function daysTillDeadline(blocked: BlockedUserInfo[] | null): number | null {
    if (blocked == null || blocked.length === 0 || blocked[0].deadline == null) {
        return null;
    }
    return Math.ceil((blocked[0].deadline - getUnixTime(new Date())) / 86400);
}

const blockDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => {
        const level = blockingLevel(props.card?.blocking.blocked?.map(bu => bu.blockedOperation) ?? []);
        const days = daysTillDeadline(props.card?.blocking.blocked ?? null);
        const reason = new RichTextValue(props.card?.blocking.blocked?.[0]?.reasonSrc ?? "");
        return {
            level,
            temporary: days != null,
            days: days ?? 3,
            reasonOpen: !!reason.text,
            reason
        }
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.setStatus("submitted");
        const prev = formik.props.card?.blocking.blocked ?? [];
        const deadline = values.temporary ? getUnixTime(add(new Date(), {days: values.days})) : null;
        formik.props.blockDialogSubmit(
            formik.props.nodeName, prev, BLOCKED_OPERATIONS[values.level], deadline, values.reason.text);
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.blockDialog.show,
        nodeName: state.blockDialog.nodeName,
        submitting: state.blockDialog.submitting,
        card: getNodeCard(state, state.blockDialog.nodeName),
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    }),
    { closeBlockDialog, blockDialogSubmit }
);

export default connector(withFormik(blockDialogLogic)(BlockDialog));

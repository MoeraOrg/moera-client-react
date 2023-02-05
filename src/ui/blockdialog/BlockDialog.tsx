import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { add, getUnixTime } from 'date-fns';
import { Trans, useTranslation } from 'react-i18next';

import { BlockedOperation, BlockedUserInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
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
    const {
        show, nodeName, fullName, entryNodeName, submitting, homeOwnerName, nameDisplayMode, closeBlockDialog, values,
        resetForm
    } = props;

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

    const name = formatFullName(nodeName, fullName, nameDisplayMode);

    const isChecked = (v: BlockingLevel) => (value: BlockingLevel) => value === v;

    return (
        <ModalDialog title={entryNodeName == null ? t("blocking-node", {name}) : t("kicking-node", {name})}
                     className="block-dialog" onClose={closeBlockDialog}>
            <Form>
                <div className="modal-body">
                    <RadioField<BlockingLevel> id="level-none" name="level"
                                               title={entryNodeName == null ? t("no-block") : t("no-kick")}
                                               groupClassName="mb-0" isChecked={isChecked("none")}
                                               value="none" anyValue/>
                    <RadioField<BlockingLevel> id="level-ignore" name="level"
                                               title={
                                                   entryNodeName == null
                                                       ? t("hide-in-discussions")
                                                       : t("hide-in-discussion")
                                               }
                                               groupClassName="mb-0" isChecked={isChecked("ignore")}
                                               value="ignore" anyValue/>
                    {(entryNodeName == null || entryNodeName === homeOwnerName) &&
                        <>
                            <RadioField<BlockingLevel> id="level-comments" name="level"
                                                       title={t("deny-comments")} groupClassName="mb-0"
                                                       isChecked={isChecked("comments")} value="comments" anyValue/>
                            <RadioField<BlockingLevel> id="level-reactions" name="level"
                                                       title={t("deny-comments-reactions")} groupClassName="mb-0"
                                                       isChecked={isChecked("reactions")} value="reactions" anyValue/>
                            <RadioField<BlockingLevel> id="level-hide" name="level"
                                                       title={
                                                           entryNodeName == null
                                                               ? t("deny-everything-hide")
                                                               : t("deny-everything-hide-in-discussion")
                                                       }
                                                       isChecked={isChecked("hide")} value="hide" anyValue/>
                        </>
                    }
                    {values.level !== "none" &&
                        <>
                            <hr/>
                            {entryNodeName == null &&
                                <div className="unblock-days">
                                    <CheckboxField name="temporary" groupClassName="mb-0"
                                                   title={values.temporary ? undefined : t("unblock-after-time")}
                                                   anyValue/>
                                    {values.temporary &&
                                        <Trans i18nKey="unblock-after-days" values={{count: values.days}}>
                                            <NumberField name="days" horizontal min={1} max={1000}/>
                                        </Trans>
                                    }
                                </div>
                            }
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
                        {
                            entryNodeName == null
                                ? (values.level !== "none" ? t("block") : t("unblock"))
                                : (values.level !== "none" ? t("kick") : t("unkick"))
                        }
                    </Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

function daysTillDeadline(blocked: BlockedUserInfo[]): number | null {
    if (blocked.length === 0 || blocked[0].deadline == null) {
        return null;
    }
    return Math.ceil((blocked[0].deadline - getUnixTime(new Date())) / 86400);
}

const blockDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => {
        const level = blockingLevel(props.prevBlocked.map(bu => bu.blockedOperation));
        const days = daysTillDeadline(props.prevBlocked);
        const reason = new RichTextValue(props.prevBlocked[0]?.reasonSrc ?? "");
        return {
            level,
            temporary: days != null,
            days: days ?? 3,
            reasonOpen: !!reason.text,
            reason
        }
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {nodeName, entryNodeName, entryPostingId, prevBlocked, blockDialogSubmit} = formik.props;

        formik.setStatus("submitted");
        const deadline = values.temporary ? getUnixTime(add(new Date(), {days: values.days})) : null;
        blockDialogSubmit(
            nodeName, entryNodeName, entryPostingId, prevBlocked, BLOCKED_OPERATIONS[values.level], deadline,
            values.reason.text
        );
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.blockDialog.show,
        nodeName: state.blockDialog.nodeName,
        fullName: state.blockDialog.fullName,
        entryNodeName: state.blockDialog.entryNodeName,
        entryPostingId: state.blockDialog.entryPostingId,
        prevBlocked: state.blockDialog.prevBlocked,
        submitting: state.blockDialog.submitting,
        homeOwnerName: getHomeOwnerName(state),
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    }),
    { closeBlockDialog, blockDialogSubmit }
);

export default connector(withFormik(blockDialogLogic)(BlockDialog));

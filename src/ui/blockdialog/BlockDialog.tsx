import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, useFormikContext, withFormik } from 'formik';
import { add, getUnixTime } from 'date-fns';
import { Trans, useTranslation } from 'react-i18next';

import { BlockedOperation, BlockedUserInfo } from "api";
import { ClientState } from "state/state";
import { getHomeOwnerName } from "state/home/selectors";
import { getSetting } from "state/settings/selectors";
import { blockDialogSubmit, closeBlockDialog } from "state/blockdialog/actions";
import { NameDisplayMode } from "ui/types";
import { Button, ModalDialog } from "ui/control";
import { CheckboxField, NumberField, RadioField } from "ui/control/field";
import { RichTextValue, RichTextField } from "ui/control/richtexteditor";
import { formatFullName } from "util/names";
import store from "state/store";
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

interface OuterProps {
    nodeName: string;
    fullName: string | null;
    entryNodeName: string | null;
    entryPostingId: string | null;
    prevBlocked: BlockedUserInfo[];
    nameDisplayMode: NameDisplayMode;
}

interface Values {
    formattedName: string;
    level: BlockingLevel;
    temporary: boolean;
    days: number;
    reasonOpen: boolean;
    reason: RichTextValue;
}

type Props = OuterProps & FormikProps<Values>;

function BlockDialogInner({entryNodeName}: Props) {
    const homeOwnerName = useSelector(getHomeOwnerName);
    const dispatch = useDispatch();
    const {values, isSubmitting} = useFormikContext<Values>();
    const {t} = useTranslation();

    const isChecked = (v: BlockingLevel) => (value: BlockingLevel) => value === v;

    const title = entryNodeName == null
        ? t("blocking-node", {name: values.formattedName})
        : t("kicking-node", {name: values.formattedName});

    const onClose = () => dispatch(closeBlockDialog());

    return (
        <ModalDialog title={title} className="block-dialog" onClose={onClose}>
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
                                <RichTextField name="reason" format="markdown" anyValue noMedia shortPanel/>
                            </details>
                        </>
                    }
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant={values.level !== "none" ? "danger" : "success"} type="submit"
                            loading={isSubmitting}>
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
        const formattedName = formatFullName(props.nodeName, props.fullName, props.nameDisplayMode);
        const level = blockingLevel(props.prevBlocked.map(bu => bu.blockedOperation));
        const days = daysTillDeadline(props.prevBlocked);
        const reason = new RichTextValue(props.prevBlocked[0]?.reasonSrc ?? "", "markdown");
        return {
            formattedName,
            level,
            temporary: days != null,
            days: days ?? 3,
            reasonOpen: !!reason.text,
            reason
        }
    },

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const {nodeName, entryNodeName, entryPostingId, prevBlocked} = formik.props;

        formik.setStatus("submitted");
        const deadline = values.temporary ? getUnixTime(add(new Date(), {days: values.days})) : null;
        store.dispatch(blockDialogSubmit(
            nodeName, values.formattedName, entryNodeName, entryPostingId, prevBlocked,
            BLOCKED_OPERATIONS[values.level], deadline, values.reason.text
        ));
        formik.setSubmitting(false);
    }

};

const BlockDialogOuter = withFormik(blockDialogLogic)(BlockDialogInner);

export default function BlockDialog() {
    const nodeName = useSelector((state: ClientState) => state.blockDialog.nodeName);
    const fullName = useSelector((state: ClientState) => state.blockDialog.fullName);
    const entryNodeName = useSelector((state: ClientState) => state.blockDialog.entryNodeName);
    const entryPostingId = useSelector((state: ClientState) => state.blockDialog.entryPostingId);
    const prevBlocked = useSelector((state: ClientState) => state.blockDialog.prevBlocked);
    const nameDisplayMode = useSelector((state: ClientState) =>
        getSetting(state, "full-name.display")) as NameDisplayMode;

    return <BlockDialogOuter nodeName={nodeName} fullName={fullName} entryNodeName={entryNodeName}
                             entryPostingId={entryPostingId} prevBlocked={prevBlocked}
                             nameDisplayMode={nameDisplayMode}/>;
}

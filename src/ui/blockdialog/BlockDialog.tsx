import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { BlockedOperation } from "api/node/api-types";
import { ClientState } from "state/state";
import { getNodeCard } from "state/nodecards/selectors";
import { getSetting } from "state/settings/selectors";
import { blockDialogSubmit, closeBlockDialog } from "state/blockdialog/actions";
import { NameDisplayMode } from "ui/types";
import { Button, ModalDialog } from "ui/control";
import { RadioField } from "ui/control/field";
import { formatFullName } from "util/misc";

type BlockingLevel = "none" | "ignore" | "comments" | "reactions" | "hide";

const BLOCKED_OPERATIONS: Record<BlockingLevel, BlockedOperation[]> = {
    "none": [],
    "ignore": ["instant", "visibility"],
    "comments": ["comment"],
    "reactions": ["comment", "reaction"],
    "hide": ["comment", "reaction", "instant", "visibility"]
}

interface Values {
    level: BlockingLevel;
}

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function BlockDialog(props: Props) {
    const {show, nodeName, submitting, card, nameDisplayMode, closeBlockDialog, values, resetForm} = props;

    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            resetForm({values: blockDialogLogic.mapPropsToValues()});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]); // 'props' are missing on purpose

    if (!show) {
        return null;
    }

    const name = formatFullName(nodeName, card?.details.profile.fullName, nameDisplayMode);

    const isChecked = (v: BlockingLevel) => (value: BlockingLevel) => value === v;

    return (
        <ModalDialog title={t("block-node", {name})} onClose={closeBlockDialog}>
            <Form>
                <div className="modal-body">
                    <RadioField<BlockingLevel> id="level-none" name="level" title={t("no-block")}
                                               isChecked={isChecked("none")} value="none" anyValue autoFocus/>
                    <RadioField<BlockingLevel> id="level-ignore" name="level" title={t("hide")}
                                               isChecked={isChecked("ignore")} value="ignore" anyValue/>
                    <RadioField<BlockingLevel> id="level-comments" name="level" title={t("deny-comments")}
                                               isChecked={isChecked("comments")} value="comments" anyValue/>
                    <RadioField<BlockingLevel> id="level-reactions" name="level" title={t("deny-comments-reactions")}
                                               isChecked={isChecked("reactions")} value="reactions" anyValue/>
                    <RadioField<BlockingLevel> id="level-hide" name="level" title={t("deny-everything-hide")}
                                               isChecked={isChecked("hide")} value="hide" anyValue/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={closeBlockDialog}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={submitting}>
                        {values.level !== "none" ? t("block") : t("unblock")}
                    </Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const blockDialogLogic = {

    mapPropsToValues: (): Values => ({
        level: "none",
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.setStatus("submitted");
        formik.props.blockDialogSubmit(formik.props.nodeName, [], BLOCKED_OPERATIONS[values.level]);
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.blockDialog.show,
        nodeName: state.blockDialog.nodeName,
        submitting: state.blockDialog.submitting,
        card: getNodeCard(state, state.askDialog.nodeName),
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    }),
    { closeBlockDialog, blockDialogSubmit }
);

export default connector(withFormik(blockDialogLogic)(BlockDialog));

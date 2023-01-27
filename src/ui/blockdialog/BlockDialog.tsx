import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { closeBlockDialog } from "state/blockdialog/actions";
import { Button, ModalDialog } from "ui/control";
import { formatFullName } from "util/misc";
import { getNodeCard } from "state/nodecards/selectors";
import { getSetting } from "state/settings/selectors";
import { NameDisplayMode } from "ui/types";
import { RadioField } from "ui/control/field";

type BlockingLevel = "none" | "ignore" | "comments" | "reactions" | "hide";

interface Values {
    level: BlockingLevel;
}

type OuterProps = ConnectedProps<typeof connector>;

type Props = OuterProps & FormikProps<Values>;

function BlockDialog(props: Props) {
    const {show, nodeName, card, nameDisplayMode, closeBlockDialog, values, resetForm} = props;

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
                    <Button variant="primary" type="submit" loading={/*sending*/false}>
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
        // if (formik.props.nodeName != null) {
        //     if (values.subject === "s:subscribe") {
        //         formik.props.askDialogSend(formik.props.nodeName, "subscribe", null, values.message);
        //     } else {
        //         formik.props.askDialogSend(formik.props.nodeName, "friend", values.subject, values.message);
        //     }
        // }
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.blockDialog.show,
        nodeName: state.blockDialog.nodeName,
        card: getNodeCard(state, state.askDialog.nodeName),
        nameDisplayMode: getSetting(state, "full-name.display") as NameDisplayMode
    }),
    { closeBlockDialog }
);

export default connector(withFormik(blockDialogLogic)(BlockDialog));

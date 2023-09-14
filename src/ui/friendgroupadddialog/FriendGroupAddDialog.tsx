import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { PrincipalValue } from "api";
import { ClientState } from "state/state";
import { closeFriendGroupAddDialog, friendGroupAdd } from "state/friendgroupadddialog/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField, PrincipalField } from "ui/control/field";

type OuterProps = ConnectedProps<typeof connector>;

interface Values {
    title: string;
    view: PrincipalValue;
}

type Props = OuterProps & FormikProps<Values>;

function FriendGroupAddDialog(props: Props) {
    const {show, submitting, closeFriendGroupAddDialog} = props;
    const {t} = useTranslation();

    useEffect(() => {
        if (show) {
            const values = friendGroupAddDialogLogic.mapPropsToValues(props);
            props.resetForm({values});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]); // 'props' are missing on purpose

    if (!show) {
        return null;
    }

    return (
        <ModalDialog title={t("add-friend-group")} onClose={closeFriendGroupAddDialog}>
            <Form>
                <div className="modal-body">
                    <InputField name="title" title={t("name")} maxLength={63}/>
                    <PrincipalField name="view" title={t("visibility")} values={["public", "private", "admin"]}
                                    titles={{
                                        "public": t("friend-group-visibility.public"),
                                        "private": t("friend-group-visibility.private"),
                                        "admin": t("friend-group-visibility.admin")
                                    }} long/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={closeFriendGroupAddDialog}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={submitting}>{t("add-group")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const friendGroupAddDialogLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        title: "",
        view: "public"
    }),

    validationSchema: yup.object().shape({
        title: yup.string().trim().required("must-not-empty")
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        formik.props.friendGroupAdd(values.title, values.view);
        formik.setSubmitting(false);
    }

};

const connector = connect(
    (state: ClientState) => ({
        show: state.friendGroupAddDialog.show,
        submitting: state.friendGroupAddDialog.submitting
    }),
    { closeFriendGroupAddDialog, friendGroupAdd }
);

export default connector(withFormik(friendGroupAddDialogLogic)(FriendGroupAddDialog));

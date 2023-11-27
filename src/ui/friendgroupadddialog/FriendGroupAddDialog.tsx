import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, withFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

import { PrincipalValue } from "api";
import { ClientState } from "state/state";
import { closeFriendGroupAddDialog, friendGroupAdd } from "state/friendgroupadddialog/actions";
import { Button, ModalDialog } from "ui/control";
import { InputField, PrincipalField } from "ui/control/field";
import store from "state/store";

interface Values {
    title: string;
    view: PrincipalValue;
}

function FriendGroupAddDialog() {
    const submitting = useSelector((state: ClientState) => state.friendGroupAddDialog.submitting);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(closeFriendGroupAddDialog());

    return (
        <ModalDialog title={t("add-friend-group")} onClose={onClose}>
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
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={submitting}>{t("add-group")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const friendGroupAddDialogLogic = {

    mapPropsToValues: (): Values => ({
        title: "",
        view: "public"
    }),

    validationSchema: yup.object().shape({
        title: yup.string().trim().required("must-not-empty")
    }),

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        store.dispatch(friendGroupAdd(values.title, values.view));
        formik.setSubmitting(false);
    }

};

export default withFormik(friendGroupAddDialogLogic)(FriendGroupAddDialog);

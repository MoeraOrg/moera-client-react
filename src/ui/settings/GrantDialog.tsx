import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, FormikProps, withFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { GrantInfo, Scope } from "api";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { settingsGrantsDialogClose, settingsGrantsDialogConfirm } from "state/settings/actions";
import { Button, ModalDialog } from "ui/control";
import NodeName from "ui/nodename/NodeName";
import PermissionSelector from "ui/settings/PermissionSelector";

interface OuterProps {
    nodeName: string;
    grant: GrantInfo | null;
}

interface Values {
    scopes: Scope[];
}

type Props = OuterProps & FormikProps<Values>;

function GrantDialogInner({nodeName, grant}: Props) {
    const updating = useSelector((state: ClientState) => state.settings.tokens.dialog.updating);
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClose = () => dispatch(settingsGrantsDialogClose());

    return (
        <ModalDialog title={t("grant-access")} onClose={onClose}>
            <Form>
                <div className="modal-body">
                    <p>
                        {t("application-name")}: <NodeName name={nodeName} linked={false} popup={false}/>
                    </p>
                    <PermissionSelector title={t("permissions")} name="scopes" enabledPermissions={grant?.scope}/>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>{t("cancel")}</Button>
                    <Button variant="primary" type="submit" loading={updating}>{t("confirm")}</Button>
                </div>
            </Form>
        </ModalDialog>
    );
}

const tokenLogic = {

    mapPropsToValues: (props: OuterProps): Values => ({
        scopes: props.grant?.scope ?? []
    }),

    handleSubmit(values: Values, formik: FormikBag<OuterProps, Values>): void {
        const revoke = (formik.props.grant?.scope ?? []).filter(sc => !values.scopes.includes(sc));
        dispatch(settingsGrantsDialogConfirm(formik.props.nodeName, revoke));
        formik.setSubmitting(false);
    }

};

const GrantDialogOuter = withFormik(tokenLogic)(GrantDialogInner);

export default function GrantDialog() {
    const nodeName = useSelector((state: ClientState) => state.settings.grants.dialog.nodeName);
    const grant = useSelector((state: ClientState) => state.settings.grants.dialog.grant);

    return <GrantDialogOuter nodeName={nodeName} grant={grant}/>;
}

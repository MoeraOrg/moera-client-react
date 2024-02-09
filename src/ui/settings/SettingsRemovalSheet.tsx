import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikBag, withFormik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isConnectedToHome } from "state/home/selectors";
import { settingsDeleteNodeRequestCancel, settingsDeleteNodeRequestSend } from "state/settings/actions";
import { Button, Loading } from "ui/control";
import { TextField } from "ui/control/field";
import { useSettingsSheetResize } from "ui/settings/settings-hooks";
import store from "state/store";

interface Values {
    message: string;
}

function SettingsRemovalSheet() {
    const {t} = useTranslation();

    const sheetMaxHeight = useSettingsSheetResize();
    const connectedToHome = useSelector(isConnectedToHome);
    const connectingToHome = useSelector((state: ClientState) => state.home.connecting);
    const loaded = useSelector((state: ClientState) => state.settings.deleteNode.loaded);
    const loading = useSelector((state: ClientState) => state.settings.deleteNode.loading);
    const requested = useSelector((state: ClientState) => state.settings.deleteNode.requested);
    const updating = useSelector((state: ClientState) => state.settings.deleteNode.updating);
    const dispatch = useDispatch();

    const onCancelRequest = () => dispatch(settingsDeleteNodeRequestCancel());

    return (
        <div className="settings-sheet" style={{maxHeight: sheetMaxHeight}}>
            {(!connectedToHome && !connectingToHome) &&
                <div className="alert alert-warning show" role="alert">
                    {t("delete-blog-need-log-in")}
                </div>
            }
            {loaded &&
                (requested ?
                        <>
                            <p className="text-danger mt-3">
                            {t("send-request-delete-blog")}
                        </p>
                        <Button variant="success" loading={updating} onClick={onCancelRequest}>
                            {t("cancel-request")}
                        </Button>
                    </>
                :
                    <Form>
                        <p>
                            <Trans i18nKey="danger-request-delete-blog">
                                <span className="text-danger"/>
                                <span className="text-danger fw-bold"/>
                            </Trans>
                        </p>
                        <TextField name="message" title={t("why-delete-blog")} maxHeight="5em" maxLength={1024}
                                   anyValue/>
                        <Button variant="danger" type="submit" loading={updating}>
                            {t("delete-blog")}
                        </Button>
                    </Form>
                )
            }
            {(loading || connectingToHome) &&
                <Loading/>
            }
        </div>
    );
}

const settingsRemovalSheetLogic = {

    mapPropsToValues: (): Values => ({
        message: ""
    }),

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        store.dispatch(settingsDeleteNodeRequestSend(values.message.trim()));
        formik.setSubmitting(false);
    }

};

export default withFormik(settingsRemovalSheetLogic)(SettingsRemovalSheet);

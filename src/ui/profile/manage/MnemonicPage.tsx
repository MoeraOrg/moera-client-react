import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, FormikBag, FormikErrors, withFormik } from 'formik';

import { dispatch } from "state/store-sagas";
import { goToNews } from "state/navigation/actions";
import { mnemonicStore, mnemonicUnset } from "state/nodename/actions";
import { CheckboxField } from "ui/control/field";
import { Button } from "ui/control";
import GlobalTitle from "ui/mainmenu/GlobalTitle";
import MnemonicDocument from "ui/profile/manage/MnemonicDocument";
import "./MnemonicPage.css";

interface Values {
    writtenDown: boolean;
}

function MnemonicPage() {
    const {t} = useTranslation();

    const onSkip = () => dispatch(mnemonicStore());

    return (
        <>
            <GlobalTitle/>
            <main className="mnemonic-page global-page">
                <MnemonicDocument/>
                <Form>
                    <CheckboxField title={t("written-down-words")} name="writtenDown" groupClassName="written-down"
                                   errorsOnly/>
                    <Button type="submit" variant="primary" className="submit-button">{t("continue")}</Button>
                </Form>
                <Button variant="link" className="skip" onClick={onSkip}>{t("skip-for-now")}</Button>
            </main>
        </>
    );
}

const mnemonicPageLogic = {

    mapPropsToValues: (): Values => ({
        writtenDown: false
    }),

    validate: (values: Values): FormikErrors<Values> => {
        const errors: FormikErrors<Values> = {};

        if (!values.writtenDown) {
            errors.writtenDown = "need-write-down-words";
        }

        return errors;
    },

    handleSubmit(values: Values, formik: FormikBag<{}, Values>): void {
        dispatch(mnemonicUnset(false));
        dispatch(goToNews());
        formik.setSubmitting(false);
    }

};

export default withFormik(mnemonicPageLogic)(MnemonicPage);

import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Form, FormikBag, FormikErrors, withFormik } from 'formik';
import clipboardCopy from 'clipboard-copy';
import { useReactToPrint } from 'react-to-print';

import { tTitle } from "i18n";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { goToNews } from "state/navigation/actions";
import { flashBox } from "state/flashbox/actions";
import { mnemonicStore, mnemonicUnset } from "state/nodename/actions";
import { CheckboxField } from "ui/control/field";
import * as Browser from "ui/browser";
import { Button } from "ui/control";
import { Icon, msContentCopy, msPrint } from "ui/material-symbols";
import GlobalTitle from "ui/mainmenu/GlobalTitle";
import "./MnemonicPage.css";

interface ColumnProps {
    mnemonic: string[];
    start: number;
    end: number;
}

const Column = ({mnemonic, start, end}: ColumnProps) => (
    <div className="col-12 col-sm-4">
        <ol start={start + 1}>
            {mnemonic.slice(start, end).map((value, index) => (<li key={index}>{value}</li>))}
        </ol>
    </div>
);

interface Values {
    writtenDown: boolean;
}

function MnemonicPage() {
    const name = useSelector((state: ClientState) => state.nodeName.mnemonicName);
    const mnemonic = useSelector((state: ClientState) => state.nodeName.mnemonic ?? []);
    const {t} = useTranslation();

    const printRef = useRef<HTMLDivElement>(null);
    const onPrint = useReactToPrint({contentRef: printRef, documentTitle: `Secret words for ${name}`});

    const onCopy = () => {
        const text = `${t("name")}: ${name}\n\n${t("secret-words")}:\n`
            + mnemonic.map((value, index) => `${index + 1}. ${value}\n`).join("");
        clipboardCopy(text);
        if (!Browser.isAndroidBrowser()) {
            dispatch(flashBox(t("link-copied")));
        }
    }

    const onSkip = () => dispatch(mnemonicStore());

    return (
        <>
            <GlobalTitle/>
            <main className="mnemonic-page global-page" ref={printRef}>
                <div className="title">{tTitle(t("named-key"))}</div>
                <div className="name">{name}</div>
                <Trans i18nKey="write-down-words">
                    <p/>
                    <p className="fw-bold"/>
                    <p/>
                </Trans>
                <div className="words-panel">
                    <span className="words-title">{t("secret-words")}</span>
                    <Button variant="silent-round" title={t("print")} className="d-print-none" onClick={onPrint}>
                        <Icon icon={msPrint} size={20}/>
                    </Button>
                    <Button variant="silent-round" title={t("copy")} className="d-print-none" onClick={onCopy}>
                        <Icon icon={msContentCopy} size={20}/>
                    </Button>
                </div>
                <div className="row">
                    <Column mnemonic={mnemonic} start={0} end={8}/>
                    <Column mnemonic={mnemonic} start={8} end={16}/>
                    <Column mnemonic={mnemonic} start={16} end={24}/>
                </div>
                <Form className="d-print-none">
                    <CheckboxField title={t("written-down-words")} name="writtenDown" groupClassName="written-down"
                                   errorsOnly/>
                    <Button type="submit" variant="primary" className="submit-button">{t("continue")}</Button>
                </Form>
                <Button variant="link" className="skip d-print-none" onClick={onSkip}>{t("skip-for-now")}</Button>
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

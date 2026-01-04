import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';

import { tTitle } from "i18n";
import { ClientState } from "state/state";
import { dispatch } from "state/store-sagas";
import { flashBox } from "state/flashbox/actions";
import { Button } from "ui/control";
import { Icon, msContentCopy, msPrint } from "ui/material-symbols";
import * as Browser from "ui/browser";
import { clipboardCopy } from "util/clipboard";
import "./MnemonicDocument.css";

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

export default function MnemonicDocument() {
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
            dispatch(flashBox(t("words-copied")));
        }
    }

    return (
        <div className="mnemonic-document" ref={printRef}>
            <div className="title">{tTitle(t("named-key"))}</div>
            <div className="name">{name}</div>
            <div className="explanation">
                <Trans i18nKey="write-down-words">
                    <p className="d-print-none"/>
                    <p className="fw-bold"/>
                    <p/>
                </Trans>
            </div>
            <div className="words-panel">
                <span className="words-title">{t("secret-words")}</span>
                <Button variant="silent-round" title={t("print")} className="print-button d-print-none"
                        onClick={onPrint}>
                    <Icon icon={msPrint} size={20}/>
                </Button>
                <Button variant="silent-round" title={t("copy")} className="copy-button d-print-none"
                        onClick={onCopy}>
                    <Icon icon={msContentCopy} size={20}/>
                </Button>
            </div>
            <div className="row">
                <Column mnemonic={mnemonic} start={0} end={8}/>
                <Column mnemonic={mnemonic} start={8} end={16}/>
                <Column mnemonic={mnemonic} start={16} end={24}/>
            </div>
        </div>
    );
}

import React, { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import clipboardCopy from 'clipboard-copy';
import { useTranslation } from 'react-i18next';

import { flashBox } from "state/flashbox/actions";
import { closeShareDialog } from "state/sharedialog/actions";
import { Icon, msCode } from "ui/material-symbols";
import * as Browser from "ui/browser";
import { ShareTextMode } from "ui/sharedialog/share-text-mode";
import { htmlEntities } from "util/html";
import "./CopyQuoteButton.css";

interface Props {
    url: string;
    title: string;
    mode: ShareTextMode;
}

function formatLink(url: string, mode: ShareTextMode) {
    if (mode === "text") {
        return url;
    }
    const qurl = htmlEntities(url);
    return `<a href="${qurl}">${qurl}</a>`;
}

export default function CopyQuoteButton({url, title, mode}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = (event: MouseEvent) => {
        dispatch(closeShareDialog());
        clipboardCopy((title ? title + "\n\n" : "") + formatLink(url, mode))
            .then(() => {
                if (!Browser.isAndroidBrowser()) {
                    dispatch(flashBox(t("quote-copied")));
                }
            });
        event.preventDefault();
    }

    return (
        <button className="copy-quote" title={t("copy-quote")} onClick={onClick}>
            <Icon icon={msCode} size={30}/>
        </button>
    );
}

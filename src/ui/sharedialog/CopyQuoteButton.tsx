import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { flashBox } from "state/flashbox/actions";
import { closeShareDialog } from "state/sharedialog/actions";
import { Icon, msCode } from "ui/material-symbols";
import * as Browser from "ui/browser";
import { ShareTextMode } from "ui/sharedialog/share-text-mode";
import { clipboardCopy } from "util/clipboard";
import { ht } from "util/html";
import "./CopyQuoteButton.css";

interface Props {
    url: string;
    title: string;
    mode: ShareTextMode;
}

export default function CopyQuoteButton({url, title, mode}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        dispatch(closeShareDialog());
        clipboardCopy(
            (title ? title + "\n\n" : "") + (mode === "text" ? url : ht`<a href="${url}">${url}</a>`),
            mode === "text" ? undefined : ht`<a href="${url}">${title}</a>`
        )
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

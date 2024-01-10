import React, { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import clipboardCopy from 'clipboard-copy';
import { useTranslation } from 'react-i18next';

import { ShareTextMode } from "ui/sharedialog/share-text-mode";
import * as Browser from "ui/browser";
import { closeShareDialog } from "state/sharedialog/actions";
import { flashBox } from "state/flashbox/actions";
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
            <FontAwesomeIcon icon={faQuoteLeft}/>
        </button>
    );
}

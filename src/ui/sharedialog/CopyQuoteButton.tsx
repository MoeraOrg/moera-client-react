import React, { MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clipboardCopy from 'clipboard-copy';

import { ShareTextMode } from "ui/sharedialog/share-text-mode";
import { Browser } from "ui/browser";
import { closeShareDialog } from "state/sharedialog/actions";
import { flashBox } from "state/flashbox/actions";
import { htmlEntities } from "util/html";
import "./CopyQuoteButton.css";

type Props = {
    url: string;
    title: string;
    mode: ShareTextMode;
} & ConnectedProps<typeof connector>;

function formatLink(url: string, mode: ShareTextMode) {
    if (mode === "text") {
        return url;
    }
    const qurl = htmlEntities(url);
    return `<a href="${qurl}">${qurl}</a>`;
}

function CopyQuoteButton({url, title, mode, closeShareDialog, flashBox}: Props) {
    const onClick = (event: MouseEvent) => {
        closeShareDialog();
        clipboardCopy((title ? title + "\n\n" : "") + formatLink(url, mode))
            .then(() => {
                if (Browser.userAgentOs !== "android" || window.Android) {
                    flashBox("Quote copied to the clipboard");
                }
            });
        event.preventDefault();
    }

    return (
        <button className="copy-quote" title="Copy quote" onClick={onClick}>
            <FontAwesomeIcon icon="quote-left"/>
        </button>
    );
}

const connector = connect(
    null,
    { closeShareDialog, flashBox }
);

export default connector(CopyQuoteButton);

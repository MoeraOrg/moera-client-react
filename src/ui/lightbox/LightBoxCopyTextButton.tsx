import React from 'react';
import { useTranslation } from 'react-i18next';

import { dispatch } from "state/store-sagas";
import { flashBox } from "state/flashbox/actions";
import * as Browser from "ui/browser";
import { msContentCopy } from "ui/material-symbols";
import LightboxButton from "ui/react-image-lightbox/LightboxButton";
import { clipboardCopy } from "util/clipboard";

interface Props {
    text: string;
}

export default function LightBoxCopyTextButton({text}: Props) {
    const {t} = useTranslation();

    const onCopy = () => {
        clipboardCopy(text);
        if (!Browser.isAndroidBrowser()) {
            dispatch(flashBox(t("text-copied")));
        }
    };

    return (
        <LightboxButton
            title={t("copy-text-image")}
            icon={msContentCopy}
            onClick={onCopy}
        />
    );
}

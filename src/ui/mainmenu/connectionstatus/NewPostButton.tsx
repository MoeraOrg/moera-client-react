import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { isAtComposePage } from "state/navigation/selectors";
import { Icon, msAddBox } from "ui/material-symbols";
import Jump from "ui/navigation/Jump";
import { REL_HOME } from "util/rel-node-name";
import "./NewPostButton.css";

export default function NewPostButton() {
    const atCompose = useSelector(isAtComposePage);
    const {t} = useTranslation();

    if (atCompose) {
        return null;
    }

    return (
        <Jump nodeName={REL_HOME} href="/compose" className="btn btn-success new-post-button">
            <Icon icon={msAddBox} size="1.2em"/>
            &nbsp;&nbsp;{tTitle(t("new-post-button"))}
        </Jump>
    );
}

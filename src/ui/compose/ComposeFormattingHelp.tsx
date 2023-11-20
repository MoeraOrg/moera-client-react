import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useField } from 'formik';
import { Trans, useTranslation } from 'react-i18next';

import { CLIENT_SETTINGS_PREFIX, SourceFormat } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import { CloseButton } from "ui/control";
import "./ComposeFormattingHelp.css";

export default function ComposeFormattingHelp() {
    const show = useSelector((state: ClientState) => getSetting(state, "posting.body-src-format.show-help") as boolean);
    const dispatch = useDispatch();

    const [visible, setVisible] = useState<boolean>(show);

    const {t} = useTranslation();

    const toggleHelp = (show: boolean) => {
        setVisible(show);
        dispatch(settingsUpdate([{
            name: CLIENT_SETTINGS_PREFIX + "posting.body-src-format.show-help",
            value: show.toString()
        }]));
    };

    const showHelp = () => toggleHelp(true);

    const hideHelp = () => toggleHelp(false);

    useEffect(
        () => setVisible(show),
        [show, setVisible]
    );

    const [, {value: bodyFormat}] = useField<SourceFormat>("bodyFormat");
    if (bodyFormat !== "markdown") {
        return null;
    }

    if (visible) {
        return (
            <div className="dialog-help">
                <Trans i18nKey="formatting-hint">
                    <b/>
                    {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                    <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"/>
                    {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                    <a href="https://www.markdowntutorial.com/"/>
                    {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                    <a href="https://www.webfx.com/tools/emoji-cheat-sheet/"/>
                </Trans>
                <CloseButton onClick={hideHelp}/>
            </div>
        );
    } else {
        return (
            <div className="formatting-help-show" onClick={showHelp}>{t("show-formatting-hint")}</div>
        );
    }
}

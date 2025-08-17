import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Button } from "ui/control";
import { getActualSheetName } from "ui/settings/settings-menu";
import { Icon, msArrowBack } from "ui/material-symbols";
import "./SettingsBack.css";

interface Props {
    onBack: () => void;
}

export default function SettingsBack({onBack}: Props) {
    const sheetName = useSelector((state: ClientState) => getActualSheetName(state.settings.tab, state.settings.sheet));
    const {t} = useTranslation();

    return (
        <div className="settings-back">
            <Button variant="silent-round" onClick={() => onBack()}><Icon icon={msArrowBack} size={24}/></Button>
            {t(`setting.sheet.${sheetName}`)}
        </div>
    );
}

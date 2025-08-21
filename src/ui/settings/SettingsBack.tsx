import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getActualSheetName, getActualTab } from "ui/settings/settings-menu";
import MobileBack from "ui/page/MobileBack";
import "./SettingsBack.css";

interface Props {
    onBack: () => void;
}

export default function SettingsBack({onBack}: Props) {
    const tab = useSelector((state: ClientState) => getActualTab(state.settings.tab));
    const sheetName = useSelector((state: ClientState) => getActualSheetName(state.settings.tab, state.settings.sheet));
    const {t} = useTranslation();

    return (
        <MobileBack className="settings-back" href={`/settings/${tab}`} onBack={onBack}>
            {t(`setting.sheet.${sheetName}`)}
        </MobileBack>
    );
}

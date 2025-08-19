import React from 'react';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Button } from "ui/control";
import "./SettingsButtons.css";

interface Props {
    updating?: boolean;
}

export default function SettingsButtons({updating: customUpdating}: Props) {
    const updating = useSelector((state: ClientState) => state.settings.updating);
    const {dirty, handleReset} = useFormikContext();
    const {t} = useTranslation();

    return (
        <div className="settings-buttons">
            <Button variant="outline-secondary" disabled={!dirty} onClick={handleReset}>
                {t("cancel")}
            </Button>
            <Button variant="primary" type="submit" disabled={!dirty} loading={customUpdating ?? updating} compact>
                {t("save")}
            </Button>
        </div>
    );
}

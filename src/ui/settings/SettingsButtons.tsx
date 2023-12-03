import React from 'react';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { Button } from "ui/control";
import "./SettingsButtons.css";

export default function SettingsButtons() {
    const updating = useSelector((state: ClientState) => state.settings.updating);
    const {dirty, handleReset} = useFormikContext();
    const {t} = useTranslation();

    return (
        <div className="settings-buttons">
            <Button variant="secondary" className="col-sm-2 col-5" disabled={!dirty} onClick={handleReset}>
                {t("cancel")}
            </Button>
            <Button variant="primary" type="submit" className="col-sm-2 col-5" disabled={!dirty} loading={updating}
                    compact>
                {t("save")}
            </Button>
        </div>
    );
}

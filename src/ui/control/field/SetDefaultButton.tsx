import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { CLIENT_SETTINGS_PREFIX, SettingTypes, SettingValue } from "api";
import { ClientState } from "state/state";
import { getSetting, getSettingMeta } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import { msStarFilled16 } from "ui/material-symbols";
import { LabelButton } from "ui/control/LabelButton";

interface Props {
    name: string;
    setting: string;
}

export default function SetDefaultButton({name, setting}: Props) {
    const settingMeta = useSelector((state: ClientState) => getSettingMeta(state, setting));
    const settingValue = useSelector((state: ClientState) => getSetting(state, setting));
    const dispatch = useDispatch();

    const [, {value}] = useField<SettingValue>(name);

    const [assignedDefaultValue, setAssignedDefaultValue] = useState<SettingValue | null>(null);

    const {t} = useTranslation();

    if (!settingMeta || settingValue === value || assignedDefaultValue === value) {
        return null;
    }

    const onSetDefault = () => {
        setAssignedDefaultValue(value);
        dispatch(settingsUpdate([{
            name: CLIENT_SETTINGS_PREFIX + setting,
            value: SettingTypes.toString(value, settingMeta.type, settingMeta.modifiers)
        }]));
    };

    return <LabelButton icon={msStarFilled16} title={t("set-as-default")} className="form-label-button-default"
                        onClick={onSetDefault}/>
}

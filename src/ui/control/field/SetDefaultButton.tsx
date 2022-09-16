import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { ClientSettings, SettingTypes } from "api";
import { SettingValue } from "api/setting-types";
import { ClientState } from "state/state";
import { getSetting, getSettingMeta } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import { LabelButton } from "ui/control/LabelButton";

interface OwnProps {
    name: string;
    setting?: string | null;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function SetDefaultButton({name, setting, settingMeta, settingValue, settingsUpdate}: Props) {
    const [, {value}] = useField<SettingValue>(name);

    const [assignedDefaultValue, setAssignedDefaultValue] = useState<SettingValue | null>(null);

    const {t} = useTranslation();

    if (!setting || !settingMeta || settingValue === value || assignedDefaultValue === value) {
        return null;
    }

    const onSetDefault = () => {
        setAssignedDefaultValue(value);
        settingsUpdate([{
            name: ClientSettings.PREFIX + setting,
            value: SettingTypes.toString(value, settingMeta.type, settingMeta.modifiers)
        }]);
    };

    return <LabelButton icon="star" title={t("set-as-default")} className="form-label-button-default"
                        onClick={onSetDefault}/>
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        settingMeta: props.setting != null ? getSettingMeta(state, props.setting) : null,
        settingValue: props.setting != null ? getSetting(state, props.setting) : null
    }),
    { settingsUpdate }
);

export default connector(SetDefaultButton);

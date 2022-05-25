import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useField } from 'formik';

import { ClientSettings } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import { Button } from "ui/control/Button";
import "./SetDefaultButton.css";

interface OwnProps {
    name: string;
    setting?: string | null;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function SetDefaultButton({name, setting, settingValue, settingsUpdate}: Props) {
    const [, {value}] = useField<string>(name);

    const [assignedDefaultValue, setAssignedDefaultValue] = useState<string | null>(null);

    if (!setting || settingValue === value || assignedDefaultValue === value) {
        return null;
    }

    const onSetDefault = () => {
        setAssignedDefaultValue(value);
        settingsUpdate([{
            name: ClientSettings.PREFIX + setting,
            value
        }]);
    };

    return <Button variant="link" className="set-default" onClick={onSetDefault}>Set as default</Button>;
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        settingValue: props.setting != null ? getSetting(state, props.setting) as string : null
    }),
    { settingsUpdate }
);

export default connector(SetDefaultButton);

import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import { ClientSettings } from "api";
import { PrincipalValue } from "api/node/api-types";
import { ClientState } from "state/state";
import { settingsUpdate } from "state/settings/actions";
import { getSetting } from "state/settings/selectors";
import { Button, FormGroup, PrincipalSelect } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";

interface OwnProps {
    name: string;
    values?: PrincipalValue[] | null;
    long?: boolean | null;
    title?: string;
    disabled?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    initialValue?: PrincipalValue | null;
    defaultValue?: PrincipalValue | null;
    setting?: string | null;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function PrincipalFieldImpl({name, values, long, title, disabled, groupClassName, labelClassName, initialValue,
                             defaultValue, setting, settingValue, settingsUpdate}: Props) {
    const [{value}, {touched, error}, {setValue}, {undo, reset, onUndo, onReset}] =
        useUndoableField<PrincipalValue>(name, initialValue, defaultValue);

    const [assignedDefaultValue, setAssignedDefaultValue] = useState<PrincipalValue | null>(null);

    const onSetDefault = () => {
        setAssignedDefaultValue(value);
        settingsUpdate([{
            name: ClientSettings.PREFIX + setting,
            value
        }]);
    };

    return (
        <FormGroup
            title={title}
            name={name}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
            horizontal
            layout="left"
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            <PrincipalSelect value={value} values={values} long={long} className={cx({"me-2": undo || reset})}
                             disabled={disabled} onChange={v => setValue(v)}/>
            {(setting && settingValue !== value && assignedDefaultValue !== value) &&
                <Button variant="link" className="set-default" onClick={onSetDefault}>Set as default</Button>
            }
            {touched && error && <div className="invalid-feedback">{error}</div>}
        </FormGroup>
    );
}

const connector = connect(
    (state: ClientState, props: OwnProps) => ({
        settingValue: props.setting != null ? getSetting(state, props.setting) as PrincipalValue : null
    }),
    { settingsUpdate }
);

export const PrincipalField = connector(PrincipalFieldImpl);

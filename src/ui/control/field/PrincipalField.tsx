import React from 'react';

import { useUndoableField } from "ui/control/field/undoable-field";
import { FormGroup } from "ui/control/FormGroup";
import { PrincipalSelect } from "ui/control/PrincipalSelect";

interface Props {
    name: string;
    long?: boolean | null;
    title?: string;
    groupClassName?: string;
    labelClassName?: string;
    initialValue?: string | null;
    defaultValue?: string | null;
}

export function PrincipalField({name, long, title, groupClassName, labelClassName, initialValue, defaultValue}: Props) {
    const [{value}, {touched, error}, {setValue}, {undo, reset, onUndo, onReset}] =
        useUndoableField<string>(name, initialValue, defaultValue);

    return (
        <FormGroup
            title={title}
            name={name}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
            horizontal
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            <PrincipalSelect value={value} long={long} onChange={v => setValue(v)}/>
            {touched && error && <div className="invalid-feedback">{error}</div>}
        </FormGroup>
    );
}

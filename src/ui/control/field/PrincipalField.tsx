import React from 'react';
import cx from 'classnames';

import { PrincipalValue } from "api/node/api-types";
import { useUndoableField } from "ui/control/field/undoable-field";
import { FormGroup } from "ui/control/FormGroup";
import { PrincipalSelect } from "ui/control/PrincipalSelect";

interface Props {
    name: string;
    values?: PrincipalValue[] | null;
    long?: boolean | null;
    title?: string;
    disabled?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    initialValue?: PrincipalValue | null;
    defaultValue?: PrincipalValue | null;
}

export function PrincipalField({name, values, long, title, disabled, groupClassName, labelClassName, initialValue,
                                defaultValue}: Props) {
    const [{value}, {touched, error}, {setValue}, {undo, reset, onUndo, onReset}] =
        useUndoableField<PrincipalValue>(name, initialValue, defaultValue);

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
            {touched && error && <div className="invalid-feedback">{error}</div>}
        </FormGroup>
    );
}

import React from 'react';
import cx from 'classnames';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { PrincipalFlag, PrincipalValue } from "api";
import { FormGroup, PrincipalSelect } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import FieldError from "ui/control/field/FieldError";

interface Props {
    name: string;
    values?: PrincipalFlag[] | null;
    icons?: Partial<Record<PrincipalValue, IconProp>> | null;
    titles?: Partial<Record<PrincipalValue, string>> | null;
    caption?: string | null;
    long?: boolean | null;
    title?: string;
    disabled?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    initialValue?: PrincipalValue | null;
    defaultValue?: PrincipalValue | null;
    setting?: string;
}

export function PrincipalField({
    name, values, icons, titles, caption, long, title, disabled, groupClassName, labelClassName, initialValue,
    defaultValue, setting
}: Props) {
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
            setting={setting}
            onUndo={onUndo}
            onReset={onReset}
        >
            <PrincipalSelect value={value} values={values} icons={icons} titles={titles} caption={caption} long={long}
                             className={cx({"me-2": undo || reset})} disabled={disabled} onChange={v => setValue(v)}/>
            {touched && <FieldError error={error}/>}
        </FormGroup>
    );
}

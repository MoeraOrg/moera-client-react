import React from 'react';

import { EmojiListInput, Wrapper } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import { FormGroup } from "ui/control/FormGroup";

interface Props {
    name: string;
    title?: string;
    disabled?: boolean;
    horizontal?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    col?: string;
    noFeedback?: boolean;
    initialValue?: string;
    defaultValue?: string;
    negative: boolean;
    advanced?: boolean;
}

export function EmojiListInputField({name, title, disabled, horizontal = false, groupClassName, labelClassName, col,
                                     noFeedback = false, initialValue, defaultValue, negative, advanced}: Props) {

    const [{value}, {touched, error}, {setValue}, {undo, reset, onUndo, onReset}] =
        useUndoableField<string>(name, initialValue, defaultValue);

    return (
        <FormGroup
            title={title}
            name={name}
            horizontal={horizontal}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            <Wrapper className={col}>
                <EmojiListInput className="form-control" negative={negative} value={value} advanced={advanced}
                                disabled={disabled} onChange={v => setValue(v)}/>
                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
            </Wrapper>
        </FormGroup>
    );
}

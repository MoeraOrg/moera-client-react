import React from 'react';

import { EmojiListInput, FormGroup, Wrapper } from "ui/control";
import { FormGroupStyle } from "ui/control/FormGroup";
import { useUndoableField } from "ui/control/field/undoable-field";
import FieldError from "ui/control/field/FieldError";

interface Props {
    name: string;
    title?: string;
    disabled?: boolean;
    horizontal?: boolean;
    layout?: FormGroupStyle;
    groupClassName?: string;
    labelClassName?: string;
    col?: string;
    noFeedback?: boolean;
    initialValue?: string | null;
    defaultValue?: string | null;
    negative: boolean;
    advanced?: boolean;
    setting?: string;
}

export function EmojiListInputField({name, title, disabled, horizontal = false, layout, groupClassName, labelClassName,
                                     col, noFeedback = false, initialValue, defaultValue, negative, advanced,
                                     setting}: Props) {

    const [{value}, {touched, error}, {setValue}, {undo, reset, onUndo, onReset}] =
        useUndoableField<string>(name, initialValue, defaultValue);

    return (
        <FormGroup
            title={title}
            name={name}
            horizontal={horizontal}
            layout={layout}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
            undo={undo}
            reset={reset}
            setting={setting}
            onUndo={onUndo}
            onReset={onReset}
        >
            <Wrapper className={col}>
                <EmojiListInput className="form-control" negative={negative} value={value} advanced={advanced}
                                disabled={disabled} onChange={v => setValue(v)}/>
                {!noFeedback && touched && <FieldError error={error}/>}
            </Wrapper>
        </FormGroup>
    );
}

import React from 'react';
import { NumberPicker } from 'react-widgets';

import { FormGroup, Wrapper } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import FieldError from "ui/control/field/FieldError";
import { InfoQuantity, InfoQuantityUnit } from "util/info-quantity";
import "./InfoQuantityField.css";

const UNITS: InfoQuantityUnit[] = ["bytes", "KiB", "MiB", "GiB"];

interface Props {
    name: string;
    title?: string;
    horizontal?: boolean;
    groupClassName?: string;
    labelClassName?: string;
    col?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    noFeedback?: boolean;
    min?: number | null;
    max?: number | null;
    initialValue?: number | null;
    defaultValue?: number | null;
}

export function InfoQuantityField({name, title, horizontal = false, groupClassName, labelClassName, col,
                                   noFeedback = false, autoFocus, disabled, initialValue, defaultValue,
                                   min, max}: Props) {

    const dmin = min != null ? InfoQuantity.ofBytes(min) : InfoQuantity.MIN;
    const dmax = max != null ? InfoQuantity.ofBytes(max) : InfoQuantity.MAX;

    const initialValueS = InfoQuantity.ofBytes(initialValue).toString();
    const defaultValueS = InfoQuantity.ofBytes(defaultValue).toString();

    const [{value}, {touched, error}, {setValue}, {undo, reset, onUndo, onReset}] =
        useUndoableField<string>(name, initialValueS, defaultValueS);
    const quantity = InfoQuantity.parse(value);

    const onChange = (newUnit: InfoQuantityUnit | null, newAmount: number | null) => {
        let {unit, amount} = quantity;
        if (newUnit != null) {
            unit = newUnit;
        }
        if (newAmount != null) {
            amount = newAmount;
        }
        const min = dmin.toUnitCeil(unit);
        const max = dmax.toUnitFloor(unit);
        if (min != null && amount < min) {
            amount = min;
        }
        if (max != null && amount > max) {
            amount = max;
        }
        setValue(new InfoQuantity(amount, unit).toString());
    };

    return (
        <FormGroup
            title={title}
            name={name + "_amount"}
            horizontal={horizontal}
            labelClassName={labelClassName}
            groupClassName={groupClassName}
            undo={undo}
            reset={reset}
            onUndo={onUndo}
            onReset={onReset}
        >
            {/* <label> is not functional, because NumberPicker doesn't allow to set id */}
            <Wrapper className={col}>
                <div className="info-quantity-control">
                    <NumberPicker
                        name={name + "_amount"}
                        value={quantity.amount}
                        onChange={v => onChange(null, v)}
                        autoFocus={autoFocus}
                        disabled={disabled}
                        min={dmin.toUnitCeil(quantity.unit) ?? undefined}
                        max={dmax.toUnitFloor(quantity.unit) ?? undefined}
                    />
                    <select name={name + "_unit"} value={quantity.unit} disabled={disabled}
                            onChange={e => onChange(e.target.value as InfoQuantityUnit, null)}>
                        {UNITS.map(unit => (
                            dmax.toBytes() >= new InfoQuantity(1, unit).toBytes() ?
                                <option key={unit} value={unit}>{unit}</option>
                            :
                                null
                        ))}
                    </select>
                </div>
                {!noFeedback && touched && <FieldError error={error}/>}
            </Wrapper>
        </FormGroup>
    );
}

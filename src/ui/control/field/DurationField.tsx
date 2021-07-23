import React from 'react';
import { NumberPicker } from 'react-widgets';
import cx from 'classnames';

import { Wrapper } from "ui/control";
import { useUndoableField } from "ui/control/field/undoable-field";
import { FormGroup } from "ui/control/FormGroup";
import { Duration, DurationUnit, FixedUnit, isFixedUnit } from "util/duration";
import "./DurationField.css";

interface UnitName {
    short: FixedUnit;
    long: string;
}

const UNITS: UnitName[] = [
    {short: "s", long: "seconds"},
    {short: "m", long: "minutes"},
    {short: "h", long: "hours"},
    {short: "d", long: "days"}
];

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
    min?: string;
    max?: string;
    never?: boolean;
    always?: boolean;
    initialValue?: string;
    defaultValue?: string;
}

export function DurationField({name, title, horizontal = false, groupClassName, labelClassName, col, noFeedback = false,
                               autoFocus, disabled, initialValue, defaultValue, min, max, never, always}: Props) {

    const dmin = min != null ? Duration.parse(min) : Duration.MIN;
    const dmax = max != null ? Duration.parse(max) : Duration.MAX;

    const [{value}, {touched, error}, {setValue}, {undo, reset, onUndo, onReset}] =
        useUndoableField<string>(name, initialValue, defaultValue);
    const duration = Duration.parse(value);

    const onChange = (newUnit: DurationUnit | null, newAmount: number | null) => {
        let {unit, amount} = duration;
        if (newUnit != null) {
            unit = newUnit;
        }
        if (newAmount != null) {
            amount = newAmount;
        }
        if (isFixedUnit(unit)) {
            const min = dmin.toUnitCeil(unit);
            const max = dmax.toUnitFloor(unit);
            if (min != null && amount < min) {
                amount = min;
            }
            if (max != null && amount > max) {
                amount = max;
            }
        }
        setValue(new Duration(amount, unit).toString());
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
                <div className="duration-control">
                    <span className={cx({"d-none": !duration.isFixed()})}>
                        <NumberPicker
                            name={name + "_amount"}
                            value={duration.amount}
                            onChange={v => onChange(null, v)}
                            autoFocus={autoFocus}
                            disabled={disabled}
                            min={(isFixedUnit(duration.unit) ? dmin.toUnitCeil(duration.unit) : null) ?? undefined}
                            max={(isFixedUnit(duration.unit) ? dmax.toUnitFloor(duration.unit) : null) ?? undefined}
                        />
                    </span>
                    <select name={name + "_unit"} value={duration.unit} disabled={disabled}
                            onChange={e => onChange(e.target.value as DurationUnit, null)}>
                        {never && <option value="never">never</option>}
                        {UNITS.map(({short, long}) => (
                            dmax.toSeconds() >= new Duration(1, short).toSeconds() ?
                                <option key={short} value={short}>{long}</option>
                            :
                                null
                        ))}
                        {always && <option value="always">always</option>}
                    </select>
                </div>
                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
            </Wrapper>
        </FormGroup>
    );
}

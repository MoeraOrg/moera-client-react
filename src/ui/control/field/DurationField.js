import React from 'react';
import PropType from 'prop-types';
import { NumberPicker } from 'react-widgets';
import cx from 'classnames';
import { Field } from 'formik';
import selectn from 'selectn';

import { Wrapper } from "ui/control";
import { FormFieldGroup } from "ui/control/field";
import Duration from "util/duration";
import "./DurationField.css";

const UNITS = [
    {short: "s", long: "seconds"},
    {short: "m", long: "minutes"},
    {short: "h", long: "hours"},
    {short: "d", long: "days"}
];

export class DurationField extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        title: PropType.string,
        horizontal: PropType.bool,
        groupClassName: PropType.string,
        labelClassName: PropType.string,
        col: PropType.string,
        autoFocus: PropType.bool,
        disabled: PropType.bool,
        noFeedback: PropType.bool,
        min: PropType.string,
        max: PropType.string,
        never: PropType.bool,
        always: PropType.bool,
        initialValue: PropType.string,
        defaultValue: PropType.string
    };

    onChange = (form, fieldName, newUnit, newAmount) => {
        let duration = Duration.parse(form.values[fieldName]);
        if (newUnit != null) {
            duration.unit = newUnit;
        }
        if (newAmount != null) {
            duration.amount = newAmount;
        }
        const min = this.getMin().toUnitCeil(duration.unit);
        const max = this.getMax().toUnitFloor(duration.unit);
        if (duration.amount < min) {
            duration.amount = min;
        }
        if (duration.amount > max) {
            duration.amount = max;
        }
        form.setFieldValue(fieldName, duration.toString());
    };

    getMin() {
        return this.props.min != null ? Duration.parse(this.props.min) : Duration.MIN;
    }

    getMax() {
        return this.props.max != null ? Duration.parse(this.props.max) : Duration.MAX;
    }

    render() {
        const {name, title, horizontal = false, groupClassName, labelClassName, col, noFeedback = false,
               autoFocus, disabled, initialValue, defaultValue, never, always} = this.props;

        return (
            <Field name={name}>
                {({field, form}) => {
                    const duration = Duration.parse(field.value);
                    const touched = selectn(field.name, form.touched);
                    const error = selectn(field.name, form.errors);
                    return (
                        <FormFieldGroup
                            title={title}
                            name={name + "_amount"}
                            horizontal={horizontal}
                            labelClassName={labelClassName}
                            groupClassName={groupClassName}
                            field={field}
                            form={form}
                            initialValue={initialValue}
                            defaultValue={defaultValue}
                        >
                            {/* <label> is not functional, because NumberPicker doesn't allow to set id */}
                            <Wrapper className={col}>
                                <div className="duration-control">
                                    <span className={cx({"d-none": !duration.isFixed()})}>
                                        <NumberPicker
                                            name={field.name + "_amount"}
                                            value={duration.amount}
                                            onChange={v => this.onChange(form, field.name, null, v)}
                                            autoFocus={autoFocus}
                                            disabled={disabled}
                                            min={this.getMin().toUnitCeil(duration.unit)}
                                            max={this.getMax().toUnitFloor(duration.unit)}
                                        />
                                    </span>
                                    <select name={field.name + "_unit"} value={duration.unit} disabled={disabled}
                                            onChange={e => this.onChange(form, field.name, e.target.value, null)}>
                                        {never && <option value="never">never</option>}
                                        {UNITS.map(({short, long}) => (
                                            this.getMax().toSeconds() >= new Duration(1, short).toSeconds() ?
                                                <option key={short} value={short}>{long}</option>
                                            :
                                                null
                                        ))}
                                        {always && <option value="always">always</option>}
                                    </select>
                                </div>
                                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
                            </Wrapper>
                        </FormFieldGroup>
                    );
                }}
            </Field>
        );
    }

}

import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import cx from 'classnames';

import { FormFieldGroup } from "ui/control/field";

import "./CheckboxField.css";

export class CheckboxField extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        title: PropType.string,
        autoFocus: PropType.bool,
        single: PropType.bool,
        initialValue: PropType.bool,
        defaultValue: PropType.bool
    };

    constructor(props) {
        super(props);
        this.inputDom = null;
    }

    componentDidMount() {
        if (this.props.autoFocus && this.inputDom) {
            this.inputDom.focus();
        }
    }

    render() {
        const {name, title, single, initialValue, defaultValue} = this.props;

        return (
            <Field name={name}>
                {({field, form}) => {
                    const touched = form.touched[field.name];
                    const error = form.errors[field.name];
                    return (
                        <FormFieldGroup
                            title={title}
                            name={name}
                            checkbox={!single}
                            field={field}
                            form={form}
                            initialValue={initialValue}
                            defaultValue={defaultValue}
                        >
                            <>
                                <input
                                    {...field}
                                    checked={!!field.value}
                                    id={name}
                                    type="checkbox"
                                    className={cx({
                                        "form-check-input": !single,
                                        "form-control": single,
                                        "checkbox-control-single": single
                                    })}
                                    ref={dom => {this.inputDom = dom}}
                                />
                                {touched && error && <div className="invalid-feedback">{error}</div>}
                            </>
                        </FormFieldGroup>
                    );
                }}
            </Field>
        );
    }

}

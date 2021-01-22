import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import selectn from 'selectn';
import cx from 'classnames';

import { FormFieldGroup } from "ui/control/field";
import { RichTextArea } from "ui/control";

export class RichTextField extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        title: PropType.string,
        rows: PropType.number,
        placeholder: PropType.string,
        autoFocus: PropType.bool,
        anyValue: PropType.bool,
        className: PropType.string,
        autoComplete: PropType.string,
        noFeedback: PropType.bool,
        disabled: PropType.bool,
        initialValue: PropType.string,
        defaultValue: PropType.string,
        smileysEnabled: PropType.bool,
        onKeyDown: PropType.func
    };

    static defaultProps = {
        rows: 3,
        placeholder: "Enter text here..."
    }

    render() {
        const {
            name, title, rows, placeholder, autoFocus, anyValue, className, autoComplete, noFeedback = false,
            disabled = false, initialValue, defaultValue, smileysEnabled, onKeyDown
        } = this.props;

        return (
            <Field name={name}>
                {({field, form}) => {
                    const touched = selectn(field.name, form.touched);
                    const error = selectn(field.name, form.errors);
                    return (
                        <FormFieldGroup
                            title={title}
                            name={name}
                            field={field}
                            form={form}
                            initialValue={initialValue}
                            defaultValue={defaultValue}
                        >
                            <>
                                <RichTextArea
                                    {...field}
                                    id={name}
                                    className={cx(
                                        "form-control", {
                                            "is-valid": !anyValue && touched && !error,
                                            "is-invalid": !anyValue && touched && error,
                                            [className]: !!className
                                        })}
                                    autoFocus={autoFocus}
                                    autoComplete={autoComplete}
                                    placeholder={placeholder}
                                    rows={rows}
                                    disabled={disabled}
                                    smileysEnabled={smileysEnabled}
                                    onKeyDown={onKeyDown}
                                />
                                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
                            </>
                        </FormFieldGroup>
                    );
                }}
            </Field>
        );
    }

}

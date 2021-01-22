import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import selectn from 'selectn';
import cx from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';

import { FormFieldGroup } from "ui/control/field";

export class TextField extends React.PureComponent {

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
        onKeyDown: PropType.func,
        onChange: PropType.func,
        onInput: PropType.func
    };

    static defaultProps = {
        rows: 3,
        placeholder: "Enter text here..."
    }

    constructor(props, context) {
        super(props, context);

        this.inputDom = React.createRef();
    }

    componentDidMount() {
        const {autoFocus, onInput} = this.props;

        if (this.inputDom.current) {
            if (onInput) {
                this.inputDom.current.addEventListener("input", onInput);
            }
            if (autoFocus) {
                this.inputDom.current.focus();
            }
        }
    }

    componentWillUnmount() {
        const {onInput} = this.props;

        if (this.inputDom.current && onInput) {
            this.inputDom.current.removeEventListener("input", onInput);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.disabled && prevProps.disabled && this.props.autoFocus && this.inputDom.current) {
            this.inputDom.current.focus();
        }
    }

    onChange = fieldOnChange => event => {
        if (this.props.onChange) {
            this.props.onChange(event);
        }
        if (fieldOnChange) {
            fieldOnChange(event);
        }
    }

    render() {
        const {name, title, rows, placeholder, anyValue, className, autoComplete, noFeedback = false, disabled = false,
               initialValue, defaultValue, onKeyDown} = this.props;

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
                                <TextareaAutosize
                                    name={field.name}
                                    value={field.value}
                                    id={name}
                                    className={cx(
                                        "form-control", {
                                            "is-valid": !anyValue && touched && !error,
                                            "is-invalid": !anyValue && touched && error,
                                            [className]: !!className
                                        })}
                                    autoComplete={autoComplete}
                                    placeholder={placeholder}
                                    rows={rows}
                                    maxRows={20}
                                    disabled={disabled}
                                    onKeyDown={onKeyDown}
                                    onBlur={field.onBlur}
                                    onChange={this.onChange(field.onChange)}
                                    ref={this.inputDom} // impossible to pass lambda here
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

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
        onKeyDown: PropType.func
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
        const {autoFocus} = this.props;

        if (this.inputDom.current && autoFocus) {
            this.inputDom.current.focus();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.disabled && prevProps.disabled && this.props.autoFocus && this.inputDom.current) {
            this.inputDom.current.focus();
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
                                    {...field}
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

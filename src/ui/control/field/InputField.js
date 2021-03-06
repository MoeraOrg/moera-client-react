import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import cx from 'classnames';
import selectn from 'selectn';

import { Wrapper } from "ui/control";
import { FormFieldGroup } from "ui/control/field";

export class InputField extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        title: PropType.string,
        placeholder: PropType.string,
        disabled: PropType.bool,
        maxLength: PropType.number,
        horizontal: PropType.bool,
        groupClassName: PropType.string,
        labelClassName: PropType.string,
        col: PropType.string,
        autoFocus: PropType.bool,
        anyValue: PropType.bool,
        className: PropType.string,
        autoComplete: PropType.string,
        noFeedback: PropType.bool,
        initialValue: PropType.string,
        defaultValue: PropType.string,
        onEscape: PropType.func,
        inputRef: PropType.func
    };

    #inputDom = null;

    componentDidMount() {
        if (this.props.autoFocus && this.#inputDom) {
            this.#inputDom.focus();
        }
    }

    onKeyDown = event => {
        const {onEscape} = this.props;

        if (onEscape && (event.key === "Escape" || event.key === "Esc")) {
            onEscape();
        }
    };

    render() {
        const {
            name, title, placeholder, disabled, maxLength, horizontal = false, groupClassName, labelClassName, col,
            anyValue, className, autoComplete, noFeedback = false, initialValue, defaultValue, inputRef
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
                            horizontal={horizontal}
                            labelClassName={labelClassName}
                            groupClassName={groupClassName}
                            field={field}
                            form={form}
                            initialValue={initialValue}
                            defaultValue={defaultValue}
                        >
                            <Wrapper className={col}>
                                <input
                                    {...field}
                                    id={name}
                                    type={!name.toLowerCase().includes("password") ? "text" : "password"}
                                    className={cx(
                                        "form-control", {
                                            "is-valid": !anyValue && touched && !error,
                                            "is-invalid": !anyValue && touched && error,
                                            [className]: !!className
                                        })}
                                    placeholder={placeholder}
                                    autoComplete={autoComplete}
                                    disabled={disabled}
                                    maxLength={maxLength}
                                    ref={dom => {
                                        this.#inputDom = dom;
                                        if (inputRef != null) {
                                            inputRef(dom);
                                        }
                                    }}
                                    onKeyDown={this.onKeyDown}
                                />
                                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
                            </Wrapper>
                        </FormFieldGroup>
                    );
                }}
            </Field>
        );
    }

}

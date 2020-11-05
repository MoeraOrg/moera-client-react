import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import selectn from 'selectn';

import { EmojiListInput, Wrapper } from "ui/control";
import { FormFieldGroup } from "ui/control/field";

export class EmojiListInputField extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        title: PropType.string,
        horizontal: PropType.bool,
        groupClassName: PropType.string,
        labelClassName: PropType.string,
        col: PropType.string,
        noFeedback: PropType.bool,
        initialValue: PropType.string,
        defaultValue: PropType.string,
        negative: PropType.bool,
        advanced: PropType.bool
    };

    render() {
        const {name, title, horizontal = false, groupClassName, labelClassName, col, noFeedback = false,
               initialValue, defaultValue, negative, advanced} = this.props;

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
                                <EmojiListInput className="form-control" negative={negative} value={field.value}
                                                advanced={advanced}
                                                onChange={v => form.setFieldValue(field.name, v)}/>
                                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
                            </Wrapper>
                        </FormFieldGroup>
                    );
                }}
            </Field>
        );
    }

}

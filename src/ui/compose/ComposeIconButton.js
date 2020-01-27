import React from 'react';
import { Field } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import "./ComposeIconButton.css";

const ComposeIconButton = ({ icon, name, changed = false, tooltip = null }) => (
    <Field name={name}>
        {({field, form}) => (
            <div className={cx(
                "composer-icon",
                {
                    "composer-icon-active": field.value,
                    "composer-icon-changed": changed
                })}
                 title={tooltip}
                 onClick={e => form.setFieldValue(field.name, !field.value)} onBlur={field.onBlur}>
                <FontAwesomeIcon icon={icon} />
            </div>
        )}
    </Field>
);

export default ComposeIconButton;

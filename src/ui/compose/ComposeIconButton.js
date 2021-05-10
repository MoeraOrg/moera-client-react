import React from 'react';
import { useField } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import "./ComposeIconButton.css";

export default function ComposeIconButton({icon, name, changed = false, tooltip = null}) {
    const [{onBlur}, {value}, {setValue}] = useField(name);

    const onClick = () => setValue(!value);

    return (
        <div className={cx("composer-icon", {"composer-icon-active": value, "composer-icon-changed": changed})}
             title={tooltip} onClick={onClick} onBlur={onBlur}>
            <FontAwesomeIcon icon={icon}/>
        </div>
    );
}

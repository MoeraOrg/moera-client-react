import React from 'react';
import { useField } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';

import "./ComposeIconButton.css";

interface Props {
    icon: IconProp;
    name: string;
    changed?: boolean;
    tooltip?: string | null;
}

export default function ComposeIconButton({icon, name, changed = false, tooltip = null}: Props) {
    const [{onBlur}, {value}, {setValue}] = useField<boolean>(name);

    const onClick = () => setValue(!value);

    return (
        <div className={cx("composer-icon", {"composer-icon-active": value, "composer-icon-changed": changed})}
             title={tooltip ?? undefined} onClick={onClick} onBlur={onBlur}>
            <FontAwesomeIcon icon={icon}/>
        </div>
    );
}

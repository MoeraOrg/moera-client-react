import React from 'react';
import { useField } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import cx from 'classnames';

import { ComposePageToolsTab } from "ui/compose/compose-page-logic";
import "./ComposeIconButton.css";

interface Props {
    icon: IconProp;
    name: ComposePageToolsTab;
    changed?: boolean;
    tooltip?: string | null;
}

export default function ComposeIconButton({icon, name, changed = false, tooltip = null}: Props) {
    const [{onBlur}, {value}, {setValue}] = useField<ComposePageToolsTab>("toolsTab");

    const onClick = (e: React.MouseEvent) => {
        setValue(value !== name ? name : null);
        e.preventDefault();
    }

    return (
        <button className={
            cx("composer-icon", {"composer-icon-active": value === name, "composer-icon-changed": changed})
        } title={tooltip ?? undefined} onClick={onClick} onBlur={onBlur}>
            <FontAwesomeIcon icon={icon}/>
        </button>
    );
}

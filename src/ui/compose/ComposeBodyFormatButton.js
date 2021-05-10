import React from 'react';
import { useField } from 'formik';

import ComposeIconButton from "ui/compose/ComposeIconButton";

const BODY_FORMAT_ICONS = {
    "plain-text": "remove-format",
    "html": "code",
    "markdown": ["fab", "markdown"]
};

function getTooltip(format, sourceFormats) {
    const info = sourceFormats.find(f => f.value === format);
    return info != null ? info.title : null;
}

export default function ComposeBodyFormatButton({sourceFormats, formik}) {
    const [, {value, initialValue}] = useField("bodyFormat");

    const icon = BODY_FORMAT_ICONS[value] ?? "file-alt";
    return <ComposeIconButton icon={icon} name="bodyFormatVisible" changed={value !== initialValue}
                              tooltip={getTooltip(value, sourceFormats)}/>
};

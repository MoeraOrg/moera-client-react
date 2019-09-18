import React from 'react';
import { connect as connectFormik } from 'formik';

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

const ComposeBodyFormatButton = ({sourceFormats, formik}) => {
    const format = formik.values.bodyFormat;
    let icon = BODY_FORMAT_ICONS[format];
    icon = icon != null ? icon : "file-alt";
    return <ComposeIconButton icon={icon} name="bodyFormatCustomized" tooltip={getTooltip(format, sourceFormats)} />
};

export default connectFormik(ComposeBodyFormatButton);

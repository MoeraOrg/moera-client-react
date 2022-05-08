import React from 'react';
import { useField } from 'formik';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

import ComposeIconButton from "ui/compose/ComposeIconButton";
import { Choice, SourceFormat } from "api/node/api-types";

const BODY_FORMAT_ICONS: Record<SourceFormat, IconProp | null> = {
    "plain-text": "remove-format",
    "html": "code",
    "markdown": ["fab", "markdown"],
    "application": null
};

function getTooltip(format: SourceFormat, sourceFormats: Choice<SourceFormat>[]) {
    const info = sourceFormats.find(f => f.value === format);
    return info != null ? info.title : null;
}

interface Props {
    sourceFormats: Choice<SourceFormat>[];
}

export default function ComposeBodyFormatButton({sourceFormats}: Props) {
    const [, {value, initialValue}] = useField<SourceFormat>("bodyFormat");

    const icon = BODY_FORMAT_ICONS[value] ?? "file-alt";
    return <ComposeIconButton icon={icon} name="format" changed={value !== initialValue}
                              tooltip={getTooltip(value, sourceFormats)}/>
};

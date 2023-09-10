import React from 'react';
import { useField } from 'formik';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useTranslation } from 'react-i18next';

import { SourceFormat } from "api/node/api-types";
import ComposeIconButton from "ui/compose/ComposeIconButton";

const BODY_FORMAT_ICONS: Record<SourceFormat, IconProp | null> = {
    "plain-text": "remove-format",
    "html": "code",
    "markdown": ["fab", "markdown"],
    "application": null
};

interface Props {
    sourceFormats: SourceFormat[];
}

export default function ComposeBodyFormatButton({sourceFormats}: Props) {
    const [, {value, initialValue}] = useField<SourceFormat>("bodyFormat");
    const {t} = useTranslation();

    const icon = BODY_FORMAT_ICONS[value] ?? "file-alt";
    return <ComposeIconButton icon={icon} name="format" changed={value !== initialValue}
                              tooltip={sourceFormats.includes(value) ? t(`source-format.${value}`) : null}/>
};

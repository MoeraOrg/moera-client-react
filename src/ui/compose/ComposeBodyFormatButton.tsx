import React from 'react';
import { useField } from 'formik';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCode, faFileAlt, faRemoveFormat } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';

import { SourceFormat } from "api";
import ComposeIconButton from "ui/compose/ComposeIconButton";

const BODY_FORMAT_ICONS: Record<SourceFormat, IconProp | null> = {
    "plain-text": faRemoveFormat,
    "html": faCode,
    "markdown": faMarkdown,
    "html/visual": faFileAlt,
    "application": null
};

interface Props {
    sourceFormats: SourceFormat[];
}

export default function ComposeBodyFormatButton({sourceFormats}: Props) {
    const [, {value, initialValue}] = useField<SourceFormat>("bodyFormat");
    const {t} = useTranslation();

    const icon = BODY_FORMAT_ICONS[value] ?? faFileAlt;
    const tooltip = sourceFormats.includes(value) ? t(`source-format.${value.replaceAll("/", "--")}`) : null;
    return <ComposeIconButton icon={icon} name="format" changed={value !== initialValue} tooltip={tooltip}/>
};

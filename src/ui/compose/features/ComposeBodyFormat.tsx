import React from 'react';
import { useTranslation } from 'react-i18next';

import { SourceFormat } from "api";
import { SelectField, SelectFieldChoice } from "ui/control/field";

interface Props {
    sourceFormats: SourceFormat[];
}

export default function ComposeBodyFormat({sourceFormats}: Props) {
    const {t} = useTranslation();

    const choices: SelectFieldChoice[] = sourceFormats
        .filter(f => f !== "application")
        .map(value => ({value, title: `source-format.${value.replaceAll("/", "--")}`}));
    return (
        <SelectField title={t("text-formatting")} name="bodyFormat" horizontal layout="left" groupClassName="ps-2"
                     col="col-md-3" choices={choices} anyValue/>
    );
}

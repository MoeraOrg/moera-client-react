import React from 'react';
import { useTranslation } from 'react-i18next';

import { SourceFormat } from "api/node/api-types";
import { SelectField, SelectFieldChoice } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

interface Props {
    sourceFormats: SourceFormat[];
}

export default function ComposeBodyFormat({sourceFormats}: Props) {
    const {t} = useTranslation();

    const choices: SelectFieldChoice[] = sourceFormats
        .filter(f => f !== "application")
        .map(value => ({value, title: `source-format.${value}`}));
    return (
        <ComposePageTool name="format">
            <SelectField title={t("text-formatting")} name="bodyFormat" horizontal layout="left" groupClassName="ps-2"
                         col="col-md-2" choices={choices} anyValue setting="posting.body-src-format.default"/>
        </ComposePageTool>
    );
}

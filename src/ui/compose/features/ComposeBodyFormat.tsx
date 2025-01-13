import React from 'react';

import { SourceFormat } from "api";
import { SelectField, SelectFieldChoice } from "ui/control/field";

interface Props {
    sourceFormats: SourceFormat[];
}

export default function ComposeBodyFormat({sourceFormats}: Props) {
    const choices: SelectFieldChoice[] = sourceFormats
        .filter(f => f !== "application")
        .map(value => ({value, title: `source-format.${value.replaceAll("/", "--")}`}));
    return (
        <SelectField name="bodyFormat" horizontal layout="left" groupClassName="ps-2" col="col-md-3" choices={choices}
                     anyValue/>
    );
}

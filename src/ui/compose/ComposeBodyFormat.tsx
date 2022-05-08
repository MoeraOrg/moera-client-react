import React from 'react';
import { useField } from 'formik';

import { Choice, SourceFormat } from "api/node/api-types";
import { SelectField } from "ui/control/field";
import { ComposePageToolsTab } from "ui/compose/compose-page-logic";

interface Props {
    sourceFormats: Choice<SourceFormat>[];
}

export default function ComposeBodyFormat({sourceFormats}: Props) {
    const [, {value}] = useField<ComposePageToolsTab>("toolsTab");

    if (value !== "format") {
        return null;
    }

    return (
        <SelectField title="Text formatting" name="bodyFormat" horizontal groupClassName="ps-2" col="col-md-2"
                     choices={sourceFormats.filter(c => c.value !== "application")} anyValue/>
    );
}

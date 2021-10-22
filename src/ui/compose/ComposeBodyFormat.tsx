import React from 'react';
import { useField } from 'formik';

import { SelectField } from "ui/control/field";
import { Choice, SourceFormat } from "api/node/api-types";

interface Props {
    sourceFormats: Choice<SourceFormat>[];
}

export default function ComposeBodyFormat({sourceFormats}: Props) {
    const [, {value}] = useField<boolean>("bodyFormatVisible");

    if (!value) {
        return null;
    }

    return (
        <SelectField title="Text formatting" name="bodyFormat" horizontal={true} groupClassName="ps-2" col="col-md-2"
                     choices={sourceFormats.filter(c => c.value !== "application")} anyValue/>
    );
}

import React from 'react';
import { useField } from 'formik';

import { SelectField } from "ui/control/field";

export default function ComposeBodyFormat({sourceFormats}) {
    const [, {value}] = useField("bodyFormatVisible");

    if (!value) {
        return null;
    }

    return (
        <SelectField title="Text formatting" name="bodyFormat" horizontal={true} groupClassName="pl-4"
                     col="ml-n3 ml-md-0 col-md-2" choices={sourceFormats.filter(c => c.value !== "application")}
                     anyValue/>
    );
}

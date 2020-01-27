import React from 'react';
import { connect as connectFormik } from 'formik';

import { SelectField } from "ui/control/field";

const ComposeBodyFormat = ({sourceFormats, formik}) => (
    formik.values.bodyFormatVisible &&
        <SelectField title="Text formatting" name="bodyFormat" horizontal={true} groupClassName="pl-4" col="col-md-2"
                     choices={sourceFormats.filter(c => c.value !== "application")} anyValue />
);

export default connectFormik(ComposeBodyFormat);

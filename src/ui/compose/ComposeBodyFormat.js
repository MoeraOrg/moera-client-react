import React from 'react';
import { connect as connectFormik } from 'formik';

import { SelectField } from "ui/control/field";

const ComposeBodyFormat = ({sourceFormats, formik}) => (
    formik.values.bodyFormatCustomized &&
        <SelectField title="Text formatting" name="bodyFormat" horizontal={true} groupClassName="pl-4" col="col-md-2"
                     choices={sourceFormats} anyValue />
);

export default connectFormik(ComposeBodyFormat);

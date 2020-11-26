import React from 'react';
import { connect as connectFormik } from 'formik';

import { DateTimeField } from "ui/control/field";

const ComposePublishAt = ({formik}) => (
    formik.values.publishAtVisible &&
        <DateTimeField title="Publish at" name="publishAt" horizontal={true} groupClassName="pl-4"
                       col="ml-n3 ml-md-0 col-md-4"/>
);

export default connectFormik(ComposePublishAt);

import React from 'react';
import { connect as connectFormik } from 'formik';

import { CheckboxField, InputField } from "ui/control/field";

const ComposeUpdateInfo = ({formik}) => (
    formik.values.updateInfoVisible &&
        <>
            <CheckboxField title="Notify followers about the update" name="updateImportant" groupClassName="pl-2"/>
            {
                formik.values.updateImportant &&
                    <InputField title="Update description" name="updateDescription" maxLength={128} anyValue/>
            }
        </>
);

export default connectFormik(ComposeUpdateInfo);

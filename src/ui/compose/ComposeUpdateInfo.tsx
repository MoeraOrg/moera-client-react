import React from 'react';
import { useField } from 'formik';

import { CheckboxField, InputField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

export default function ComposeUpdateInfo() {
    const [, {value: updateImportant}] = useField<boolean>("updateImportant");

    return (
        <ComposePageTool name="updated">
            <CheckboxField title="Notify followers about the update" name="updateImportant" groupClassName="ps-2"/>
            {updateImportant &&
                <InputField title="Update description" name="updateDescription" maxLength={128} anyValue/>
            }
        </ComposePageTool>
    );
}

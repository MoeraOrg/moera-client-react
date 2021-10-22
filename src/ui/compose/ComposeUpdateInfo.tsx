import React from 'react';
import { useField } from 'formik';

import { CheckboxField, InputField } from "ui/control/field";

export default function ComposeUpdateInfo() {
    const [, {value: updateInfoVisible}] = useField<boolean>("updateInfoVisible");
    const [, {value: updateImportant}] = useField<boolean>("updateImportant");

    if (!updateInfoVisible) {
        return null;
    }

    return (
        <>
            <CheckboxField title="Notify followers about the update" name="updateImportant" groupClassName="ps-2"/>
            {updateImportant &&
                <InputField title="Update description" name="updateDescription" maxLength={128} anyValue/>
            }
        </>
    );
}

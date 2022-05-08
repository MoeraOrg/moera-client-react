import React from 'react';
import { useField } from 'formik';

import { CheckboxField, InputField } from "ui/control/field";
import { ComposePageToolsTab } from "ui/compose/compose-page-logic";

export default function ComposeUpdateInfo() {
    const [, {value: toolsTab}] = useField<ComposePageToolsTab>("toolsTab");
    const [, {value: updateImportant}] = useField<boolean>("updateImportant");

    if (toolsTab !== "updated") {
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

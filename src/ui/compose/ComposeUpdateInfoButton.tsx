import React from 'react';
import { useField } from 'formik';

import ComposeIconButton from "ui/compose/ComposeIconButton";

export default function ComposeUpdateInfoButton() {
    const [, {value: updateImportant}] = useField<boolean>("updateImportant");
    const [, {value: updateDescription}] = useField<string>("updateDescription");

    return (
        <ComposeIconButton icon="bell" name="updateInfoVisible"
                           changed={updateImportant || updateDescription.length > 0} tooltip="Notify followers"/>
    );
};

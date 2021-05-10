import React from 'react';
import { useField } from 'formik';

import ComposeIconButton from "ui/compose/ComposeIconButton";

export default function ComposeUpdateInfoButton() {
    const [, {value: updateImportant}] = useField("updateImportant");
    const [, {value: updateDescription}] = useField("updateDescription");

    return (
        <ComposeIconButton icon="bell" name="updateInfoVisible" changed={updateImportant || updateDescription}
                           tooltip="Notify followers"/>
    );
};

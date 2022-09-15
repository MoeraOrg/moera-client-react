import React from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import ComposeIconButton from "ui/compose/ComposeIconButton";

export default function ComposeUpdateInfoButton() {
    const [, {value: updateImportant}] = useField<boolean>("updateImportant");
    const [, {value: updateDescription}] = useField<string>("updateDescription");

    const {t} = useTranslation();

    return (
        <ComposeIconButton icon="bell" name="updated"
                           changed={updateImportant || updateDescription.length > 0} tooltip={t("notify-followers")}/>
    );
};

import React from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { CheckboxField, InputField } from "ui/control/field";

export default function ComposeUpdateInfo() {
    const [, {value: updateImportant}] = useField<boolean>("updateImportant");

    const {t} = useTranslation();

    return (
        <>
            <CheckboxField title={t("notify-about-update")} name="updateImportant" groupClassName="ps-2" anyValue/>
            {updateImportant &&
                <InputField title={t("update-description")} name="updateDescription" maxLength={128} anyValue/>
            }
        </>
    );
}

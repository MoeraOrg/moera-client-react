import React from 'react';
import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { CheckboxField, InputField } from "ui/control/field";
import ComposePageTool from "ui/compose/ComposePageTool";

export default function ComposeUpdateInfo() {
    const [, {value: updateImportant}] = useField<boolean>("updateImportant");

    const {t} = useTranslation();

    return (
        <ComposePageTool name="updated">
            <CheckboxField title={t("notify-about-update")} name="updateImportant" groupClassName="ps-2"/>
            {updateImportant &&
                <InputField title={t("update-description")} name="updateDescription" maxLength={128} anyValue/>
            }
        </ComposePageTool>
    );
}

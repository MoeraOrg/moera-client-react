import React from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { SignUpMode } from "state/signup/state";
import { Tabs } from "ui/control";

export default function SignUpTabs() {
    const [, {value}, {setValue}] = useField<SignUpMode>("mode");
    const {t} = useTranslation();

    return (
        <Tabs<SignUpMode> tabs={[
            {
                title: t("quick-sign-up"),
                value: "quick"
            },
            {
                title: t("advanced"),
                value: "advanced"
            }
        ]} scroll="never" className="mb-3" value={value} onChange={setValue}/>
    );
}

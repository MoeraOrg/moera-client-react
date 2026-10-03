import React from 'react';
import { useTranslation } from 'react-i18next';

import { CheckboxField } from "ui/control/field";

export default function ComposeSharings() {
    const {t} = useTranslation();

    return (
        <>
            <CheckboxField
                title={t("show-list-sharings")}
                name="sharingsVisible"
                groupClassName="ps-2 mb-0"
                setting="posting.sharings.visible.default"
            />
            <CheckboxField
                title={t("show-number-sharings")}
                name="totalSharingsVisible"
                groupClassName="ps-2"
                setting="posting.sharings.totals-visible.default"
            />
        </>
    );
}

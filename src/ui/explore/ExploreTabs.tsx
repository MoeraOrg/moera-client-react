import React from 'react';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { UnderlinedTabs } from "ui/control";

interface Props {
    value: string;
    children?: React.ReactNode;
}

export default function ExploreTabs({value, children}: Props) {
    const {t} = useTranslation();

    return (
        <UnderlinedTabs tabs={[
            {
                value: "posts",
                title: tTitle(t("recommendations")),
                href: "/explore"
            },
            {
                value: "people",
                title: tTitle(t("top-50")),
                href: "/explore/people"
            },
        ]} value={value}>
            {children}
        </UnderlinedTabs>
    );
}

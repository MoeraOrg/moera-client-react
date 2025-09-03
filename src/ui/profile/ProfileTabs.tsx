import React from 'react';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { UnderlinedTabs } from "ui/control";

interface Props {
    value: string;
    children?: React.ReactNode;
}

export default function ProfileTabs({value, children}: Props) {
    const {t} = useTranslation();

    return (
        <UnderlinedTabs tabs={[
            {
                value: "posts",
                title: tTitle(t("profile-tabs.posts")),
                href: "/timeline"
            },
            {
                value: "people",
                title: tTitle(t("profile-tabs.people")),
                href: "/people"
            },
        ]} value={value}>
            {children}
        </UnderlinedTabs>
    );
}

import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { isConnectedToHome } from "state/home/selectors";
import { UnderlinedTabs } from "ui/control";

interface Props {
    value: string;
    children?: React.ReactNode;
}

export default function ExploreTabs({value, children}: Props) {
    const connectedToHome = useSelector(isConnectedToHome);
    const {t} = useTranslation();

    return (
        <UnderlinedTabs tabs={[
            {
                value: "posts",
                title: tTitle(t("recommendations")),
                href: "/explore",
                visible: connectedToHome
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

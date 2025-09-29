import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { tTitle } from "i18n";
import { ClientState } from "state/state";
import { getOwnerCard } from "state/node/selectors";
import { UnderlinedTabs } from "ui/control";
import { useIsTinyScreen } from "ui/hook";
import { useTimeline } from "ui/feed/feeds";

interface Props {
    value: string;
    children?: React.ReactNode;
}

export default function ProfileTabs({value, children}: Props) {
    const profile = useSelector((state: ClientState) => getOwnerCard(state)?.details?.profile);
    const timelineHref = useTimeline();
    const tinyScreen = useIsTinyScreen();
    const {t} = useTranslation();

    return (
        <UnderlinedTabs tabs={[
            {
                value: "about",
                title: tTitle(t("profile-tabs.about")),
                href: "/profile",
                visible: tinyScreen && (profile?.bioHtml != null || profile?.email != null),
            },
            {
                value: "posts",
                title: tTitle(t("profile-tabs.posts")),
                href: timelineHref
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

import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { useMainMenuTimeline } from "ui/mainmenu/main-menu";
import { getFeedTitle } from "ui/feed/feeds";
import Jump from "ui/navigation/Jump";

export default function MainMenuTimelineLink() {
    const {active, href} = useMainMenuTimeline();
    const {t} = useTranslation();

    return (
        <li className="nav-item">
            <Jump className={cx("nav-link", {"active": active})} nodeName="" href={href}>
                {getFeedTitle("timeline", t)}
            </Jump>
        </li>
    );
}

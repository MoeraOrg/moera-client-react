import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import useMainMenuTimeline from "ui/mainmenu/main-menu-timeline";
import { getFeedTitle } from "ui/feed/feeds";

export default function MainMenuTimelineLink() {
    const {active, href, onClick} = useMainMenuTimeline();
    const {t} = useTranslation();

    return (
        <li className="nav-item">
            <a className={cx("nav-link", {"active": active})} href={href} onClick={onClick}>
                {getFeedTitle("timeline", t)}
            </a>
        </li>
    );
}

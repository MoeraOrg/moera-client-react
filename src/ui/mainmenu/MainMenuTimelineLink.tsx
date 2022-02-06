import React from 'react';
import cx from 'classnames';

import useMainMenuTimeline from "ui/mainmenu/main-menu-timeline";

export default function MainMenuTimelineLink() {
    const {active, href, onClick} = useMainMenuTimeline();

    return (
        <li className="nav-item">
            <a className={cx("nav-link", {"active": active})} href={href} onClick={onClick}>TIMELINE</a>
        </li>
    );
}

import React from 'react';
import cx from 'classnames';

import useMainMenuTimeline from "ui/mainmenu/main-menu-timeline";

export default function MainMenuTimelineLink() {
    const {active, href, onClick} = useMainMenuTimeline();

    return (
        <li className={cx("nav-item", {"active": active})}>
            <a className="nav-link" href={href} onClick={onClick}>TIMELINE</a>
        </li>
    );
}

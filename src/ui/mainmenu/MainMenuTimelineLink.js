import React from 'react';
import cx from 'classnames';

import MainMenuTimelineAccessor from "ui/mainmenu/MainMenuTimelineAccessor";

const MainMenuTimelineLink = () => (
    <MainMenuTimelineAccessor>
        {(active, href, onClick) => (
            <li className={cx("nav-item", {"active": active})}>
                <a className="nav-link" href={href} onClick={onClick}>TIMELINE</a>
            </li>
        )}
    </MainMenuTimelineAccessor>
);

export default MainMenuTimelineLink;

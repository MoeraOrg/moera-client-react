import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';

import Jump from "ui/navigation/Jump";
import { ClientState } from "state/state";
import { Page } from "state/navigation/pages";

interface Props {
    page: Page;
    otherPages?: Page[];
    href: string;
    children: ReactNode;
}

export default function MainMenuLink({page, otherPages, href, children}: Props) {
    const currentPage = useSelector((state: ClientState) => state.navigation.page);

    return (
        <li className="nav-item">
            <Jump className={cx("nav-link", {
                "active": currentPage === page || (otherPages && otherPages.includes(currentPage))
            })} href={href}>
                {children}
            </Jump>
        </li>
    );
}

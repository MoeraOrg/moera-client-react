import React, { ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import cx from 'classnames';

import Jump from "ui/navigation/Jump";
import { ClientState } from "state/state";
import { Page } from "state/navigation/pages";

type Props = {
    page: Page;
    otherPages?: Page[];
    href: string;
    children: ReactNode;
} & ConnectedProps<typeof connector>;

const MainMenuLink = ({currentPage, page, otherPages, href, children}: Props) => (
    <li className="nav-item">
        <Jump className={cx("nav-link", {
            "active": currentPage === page || (otherPages && otherPages.includes(currentPage))
        })} href={href}>
            {children}
        </Jump>
    </li>
);

const connector = connect(
    (state: ClientState) => ({
        currentPage: state.navigation.page
    })
);

export default connector(MainMenuLink);

import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';

import Jump from "ui/navigation/Jump";

const MainMenuLink = ({currentPage, page, otherPages, href, children}) => (
    <li className={cx(
            "nav-item", {
                "active": currentPage === page || (otherPages && otherPages.includes(currentPage))
            }
        )}>
        <Jump className="nav-link" href={href}>
            {children}
        </Jump>
    </li>
);

MainMenuLink.propTypes = {
    page: PropType.string.isRequired,
    href: PropType.string.isRequired
};

export default connect(
    state => ({
        currentPage: state.navigation.page
    })
)(MainMenuLink);

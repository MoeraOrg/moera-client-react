import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';

import { goToPage } from "state/navigation/actions";

const MainMenuLink = ({rootLocation, currentPage, page, otherPages, href, goToPage, children}) => (
    <li className={cx(
            "nav-item", {
                "active": currentPage === page || (otherPages && otherPages.includes(currentPage))
            }
        )}>
        <a className="nav-link" href={rootLocation + href}
           onClick={event => {
               goToPage(page);
               event.preventDefault();
           }}>
            {children}
        </a>
    </li>
);

MainMenuLink.propTypes = {
    page: PropType.string.isRequired,
    href: PropType.string.isRequired
};

export default connect(
    state => ({
        rootLocation: state.node.root.location,
        currentPage: state.navigation.page
    }),
    { goToPage }
)(MainMenuLink);

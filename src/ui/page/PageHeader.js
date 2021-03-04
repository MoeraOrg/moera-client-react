import React from 'react';
import * as PropTypes from 'prop-types';
import cx from 'classnames';

import { Browser } from "ui/browser";
import { getPageHeaderHeight } from "util/misc";
import "./PageHeader.css";

function getHideThreshold() {
    const headerHeight = getPageHeaderHeight();
    const feedTitle = document.getElementById("feed-title");
    const feedTitleHeight = feedTitle != null ? feedTitle.getBoundingClientRect().height : 0;
    return headerHeight + feedTitleHeight;
}

class PageHeader extends React.Component {

    state = {
        invisible: false
    };

    #scroll = null;

    componentDidMount() {
        window.addEventListener("scroll", this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll = () => {
        if (Browser.isTinyScreen() && this.#scroll != null) {
            const threshold = getHideThreshold();
            this.setState({invisible: window.scrollY > this.#scroll && window.scrollY > threshold});
        }
        this.#scroll = window.scrollY;
    }

    render() {
        return (
            <div id="page-header" className={cx({"invisible": this.state.invisible})}>
                <div className="panel">
                    {this.props.children}
                </div>
            </div>
        );
    }

}

PageHeader.propTypes = {children: PropTypes.any}

export default PageHeader;

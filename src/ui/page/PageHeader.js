import React from 'react';
import * as PropTypes from 'prop-types';
import cx from 'classnames';

import { Browser } from "ui/browser";
import { getPageHeaderHeight } from "util/misc";
import "./PageHeader.css";

const HIDING_DISTANCE = 16;

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
        if (!Browser.isTinyScreen()) {
            return;
        }
        if (this.#scroll == null) {
            this.#scroll = window.scrollY;
            return;
        }
        if (window.scrollY <= getHideThreshold()) {
            this.setState({invisible: false});
            this.#scroll = window.scrollY;
            return;
        }
        const invisible = window.scrollY > this.#scroll;
        if (this.state.invisible === invisible || Math.abs(window.scrollY - this.#scroll) > HIDING_DISTANCE) {
            this.setState({invisible});
            this.#scroll = window.scrollY;
        }
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

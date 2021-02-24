import React from 'react';
import * as PropTypes from 'prop-types';
import cx from 'classnames';

import { Browser } from "ui/browser";
import { getPageHeaderHeight } from "util/misc";
import "./PageHeader.css";

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
            const headerHeight = getPageHeaderHeight();
            this.setState({invisible: window.scrollY > this.#scroll && window.scrollY > headerHeight});
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

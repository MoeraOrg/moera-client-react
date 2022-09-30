import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';

import { Browser } from "ui/browser";
import { getFeedHeaderHeight } from "util/misc";
import "./PageHeader.css";

const HIDING_DISTANCE = 16;

interface Props {
    children: any;
}

interface State {
    invisible: boolean;
    scroll: number | null;
}

function PageHeader({children}: Props) {
    const [state, setState] = useState<State>({invisible: false, scroll: null});

    const onScroll = useCallback(() => {
        if (!Browser.isTinyScreen()) {
            return;
        }
        setState(state => {
            if (state.scroll == null) {
                return {invisible: state.invisible, scroll: window.scrollY};
            }
            if (window.scrollY <= getFeedHeaderHeight()) {
                return {invisible: false, scroll: window.scrollY};
            }
            const invisible = window.scrollY > state.scroll;
            if (state.invisible === invisible || Math.abs(window.scrollY - state.scroll) > HIDING_DISTANCE) {
                return {invisible, scroll: window.scrollY};
            }
            return state;
        });
    }, [setState]);

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, [onScroll]);

    return (
        <div id="page-header" className={cx({"hidden": state.invisible})}>
            <div className="panel">
                {children}
            </div>
        </div>
    );
}

export default PageHeader;

import React from 'react';
import cx from 'classnames';

import { Loading } from "ui/control";
import { useIntersect } from "ui/hook";
import "./InstantsSentinel.css";

interface Props {
    visible: boolean;
    loading: boolean;
    title: string;
    margin: string;
    onSentinel: (intersecting: boolean) => void;
    onClick: (event: React.MouseEvent) => void;
}

export default function InstantsSentinel({visible, loading, title, margin, onSentinel, onClick}: Props) {
    const sentinel = useIntersect(onSentinel, {rootMargin: margin});

    return (
        <div className={cx({"sentinel": !loading && visible})} ref={sentinel} onClick={onClick}>
            {!loading && visible && title}
            {loading && <Loading/>}
        </div>
    );
}

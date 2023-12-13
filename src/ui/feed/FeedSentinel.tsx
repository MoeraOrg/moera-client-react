import React from 'react';
import cx from 'classnames';
import composeRefs from '@seznam/compose-react-refs';

import { Loading } from "ui/control";
import { useIntersect } from "ui/hook";
import "./FeedSentinel.css";

interface Props {
    visible: boolean;
    bottom?: boolean;
    loading: boolean;
    title: string;
    margin: string;
    onSentinel: (intersecting: boolean) => void;
    onBoundary: (intersecting: boolean) => void;
    onClick: () => void;
}

export default function FeedSentinel({
    visible, bottom = false, loading, title, margin, onSentinel, onBoundary, onClick
}: Props) {
    const sentinel = useIntersect(onSentinel, {rootMargin: margin});
    const boundary = useIntersect(onBoundary);

    return (
        <div className={cx({"feed-sentinel": visible, bottom, loading})}
             onClick={!loading && visible ? onClick: undefined}
             ref={composeRefs(sentinel, boundary)}
        >
            {!loading && visible && title}
            {loading && <Loading/>}
        </div>
    );
}

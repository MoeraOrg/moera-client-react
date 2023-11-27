import React, { useEffect, useRef } from 'react';
import cx from 'classnames';

import { Loading } from "ui/control";

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
    const sentinel = useRef<HTMLDivElement>(null);

    const onSentinelIntersect = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => onSentinel(entry.isIntersecting));
    }

    const onBoundaryIntersect = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => onBoundary(entry.isIntersecting));
    }

    const sentinelObserver = useRef<IntersectionObserver>(
        new IntersectionObserver(onSentinelIntersect, {rootMargin: margin}));
    const boundaryObserver = useRef<IntersectionObserver>(
        new IntersectionObserver(onBoundaryIntersect));

    useEffect(() => {
        if (sentinel.current != null) {
            const currentSentinelObserver = sentinelObserver.current;
            const currentBoundaryObserver = boundaryObserver.current;

            currentSentinelObserver.observe(sentinel.current);
            currentBoundaryObserver.observe(sentinel.current);

            return () => {
                currentSentinelObserver.disconnect();
                currentBoundaryObserver.disconnect();
            }
        }
    }, []);

    return (
        <div className={cx({"feed-sentinel": visible, "bottom": bottom})}
             onClick={!loading && visible ? onClick: undefined} ref={sentinel}>
            {!loading && visible && title}
            {loading && <Loading/>}
        </div>
    );
}

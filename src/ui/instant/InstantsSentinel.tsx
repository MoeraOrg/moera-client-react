import React, { useEffect, useRef } from 'react';
import cx from 'classnames';

import { Loading } from "ui/control";

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
    const sentinel = useRef<HTMLDivElement>(null);

    const onSentinelHandler = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => onSentinel(entry.isIntersecting));
    }

    const sentinelObserver = useRef<IntersectionObserver>(
        new IntersectionObserver(onSentinelHandler, {rootMargin: margin}));

    useEffect(() => {
        if (sentinel.current != null) {
            const observer = sentinelObserver.current;
            observer.observe(sentinel.current);

            return () => observer.disconnect();
        }
    }, []);

    return (
        <div className={cx({"sentinel": !loading && visible})} ref={sentinel} onClick={onClick}>
            {!loading && visible && title}
            {loading && <Loading/>}
        </div>
    );
}

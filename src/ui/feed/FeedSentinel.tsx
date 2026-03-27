import React from 'react';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import composeRefs from '@seznam/compose-react-refs';

import { tTitle } from "i18n";
import { Button, Loading } from "ui/control";
import { useIntersect } from "ui/hook";
import "./FeedSentinel.css";

interface Props {
    visible: boolean;
    bottom?: boolean;
    loading: boolean;
    margin: string;
    onSentinel: (intersecting: boolean) => void;
    onBoundary: (intersecting: boolean) => void;
    onClick: () => void;
}

export default function FeedSentinel({
    visible, bottom = false, loading, margin, onSentinel, onBoundary, onClick
}: Props) {
    const {t} = useTranslation();

    const sentinel = useIntersect(onSentinel, {rootMargin: margin});
    const boundary = useIntersect(onBoundary);

    return (
        <div className={cx({"feed-sentinel": visible, bottom, loading})} ref={composeRefs(sentinel, boundary)}>
            {!loading && visible &&
                <Button variant="outline-primary" onClick={onClick}>
                    {tTitle(t("show-more-posts"))}
                </Button>
            }
            {loading && <Loading/>}
        </div>
    );
}

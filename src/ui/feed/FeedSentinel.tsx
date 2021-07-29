import React from 'react';
import cx from 'classnames';

import { Loading } from "ui/control";

import "./FeedSentinel.css";

interface Props {
    visible: boolean;
    loading: boolean;
    title: string;
    margin: string;
    onSentinel: (intersecting: boolean) => void;
    onBoundary: (intersecting: boolean) => void;
    onClick: () => void;
}

export default class FeedSentinel extends React.PureComponent<Props> {

    sentinelObserver: IntersectionObserver;
    boundaryObserver: IntersectionObserver;

    constructor(props: Props, context: any) {
        super(props, context);

        this.sentinelObserver = new IntersectionObserver(this.onSentinel, {rootMargin: this.props.margin});
        this.boundaryObserver = new IntersectionObserver(this.onBoundary);
    }

    observeSentinel = (sentinel: HTMLDivElement) => {
        if (sentinel == null) {
            this.sentinelObserver.disconnect();
            this.boundaryObserver.disconnect();
        } else {
            this.sentinelObserver.observe(sentinel);
            this.boundaryObserver.observe(sentinel);
        }
    };

    onSentinel = (entries: IntersectionObserverEntry[]) => {
        this.props.onSentinel(entries[0].isIntersecting);
    }

    onBoundary = (entries: IntersectionObserverEntry[]) => {
        this.props.onBoundary(entries[0].isIntersecting);
    }

    render() {
        const { visible, loading, title, onClick } = this.props;

        return (
            <div className={cx({"feed-sentinel": !loading && visible})} ref={this.observeSentinel}
                 onClick={onClick}>
                {!loading && visible && title}
                <Loading active={loading} />
            </div>
        );
    }

}

import React from 'react';
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

export default class InstantsSentinel extends React.PureComponent<Props> {

    sentinelObserver: IntersectionObserver;

    constructor(props: Props, context: any) {
        super(props, context);

        this.sentinelObserver = new IntersectionObserver(this.onSentinel, {rootMargin: this.props.margin});
    }

    observeSentinel = (sentinel: HTMLDivElement) => {
        if (sentinel == null) {
            this.sentinelObserver.disconnect();
        } else {
            this.sentinelObserver.observe(sentinel);
        }
    };

    onSentinel = (entries: IntersectionObserverEntry[]) => {
        this.props.onSentinel(entries[0].isIntersecting);
    }

    render() {
        const { visible, loading, title, onClick } = this.props;

        return (
            <div className={cx({"sentinel": !loading && visible})} ref={this.observeSentinel} onClick={onClick}>
                {!loading && visible && title}
                <Loading active={loading}/>
            </div>
        );
    }

}

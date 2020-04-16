import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import { Loading } from "ui/control";

import "./FeedSentinel.css";

export default class FeedSentinel extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.sentinelObserver = new IntersectionObserver(this.onSentinel, {rootMargin: this.props.margin});
        this.boundaryObserver = new IntersectionObserver(this.onBoundary);
    }

    observeSentinel = sentinel => {
        if (sentinel == null) {
            this.sentinelObserver.disconnect();
            this.boundaryObserver.disconnect();
        } else {
            this.sentinelObserver.observe(sentinel);
            this.boundaryObserver.observe(sentinel);
        }
    };

    onSentinel = entry => {
        this.props.onSentinel(entry[0].isIntersecting);
    }

    onBoundary = entry => {
        this.props.onBoundary(entry[0].isIntersecting);
    }

    render() {
        const { visible, loading, title, onClick } = this.props;

        return (
            <div className={cx({"timeline-sentinel": !loading && visible})} ref={this.observeSentinel}
                 onClick={onClick}>
                {!loading && visible && title}
                <Loading active={loading} />
            </div>
        );
    }

}

FeedSentinel.propTypes = {
    visible: PropType.bool,
    loading: PropType.bool,
    title: PropType.string,
    margin: PropType.string,
    onSentinel: PropType.func,
    onBoundary: PropType.func,
    onClick: PropType.func
};

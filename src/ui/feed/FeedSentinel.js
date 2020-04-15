import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import { Loading } from "ui/control";

import "./FeedSentinel.css";

export default class FeedSentinel extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.observer = new IntersectionObserver(this.props.onSentinel, {rootMargin: this.props.margin});
    }

    observeSentinel = sentinel => {
        if (sentinel == null) {
            this.observer.disconnect();
        } else {
            this.observer.observe(sentinel);
        }
    };

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
    onClick: PropType.func
};

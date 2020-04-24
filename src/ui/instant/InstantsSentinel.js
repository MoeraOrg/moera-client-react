import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import { Loading } from "ui/control";

import "./InstantsSentinel.css";

export default class InstantsSentinel extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.sentinelObserver = new IntersectionObserver(this.onSentinel, {rootMargin: this.props.margin});
    }

    observeSentinel = sentinel => {
        if (sentinel == null) {
            this.sentinelObserver.disconnect();
        } else {
            this.sentinelObserver.observe(sentinel);
        }
    };

    onSentinel = entry => {
        this.props.onSentinel(entry[0].isIntersecting);
    }

    render() {
        const { visible, loading, title, onClick } = this.props;

        return (
            <div className={cx({"sentinel": !loading && visible})} ref={this.observeSentinel} onClick={onClick}>
                {!loading && visible && title}
                <Loading active={loading} />
            </div>
        );
    }

}

InstantsSentinel.propTypes = {
    visible: PropType.bool,
    loading: PropType.bool,
    title: PropType.string,
    margin: PropType.string,
    onSentinel: PropType.func,
    onClick: PropType.func
};

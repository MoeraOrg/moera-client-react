import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';

import { Loading } from "ui/control";

import "./CommentsSentinel.css";

export default class CommentsSentinel extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.boundaryObserver = new IntersectionObserver(this.onBoundary);
    }

    observeSentinel = sentinel => {
        if (sentinel == null) {
            this.boundaryObserver.disconnect();
        } else {
            this.boundaryObserver.observe(sentinel);
        }
    };

    onBoundary = entry => {
        this.props.onBoundary(entry[0].isIntersecting);
    }

    render() {
        const { visible, loading, title, onClick } = this.props;

        return (
            <div className={cx({"comments-sentinel": !loading && visible})} ref={this.observeSentinel}
                 onClick={onClick}>
                {!loading && visible && title}
                <Loading active={loading} />
            </div>
        );
    }

}

CommentsSentinel.propTypes = {
    visible: PropType.bool,
    loading: PropType.bool,
    title: PropType.string,
    onBoundary: PropType.func,
    onClick: PropType.func
};

import React from 'react';
import PropType from 'prop-types';

import { Loading } from "ui/control";
import "./CommentsSentinel.css";

export default class CommentsSentinel extends React.PureComponent {

    static propTypes = {
        visible: PropType.bool,
        loading: PropType.bool,
        title: PropType.string,
        onBoundary: PropType.func,
        onClick: PropType.func
    };

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

        if (!visible) {
            return <div className="comments-sentinel"/>;
        }
        return (
            <button className="btn btn-link comments-sentinel" ref={this.observeSentinel} onClick={onClick}>
                {!loading && title}
                <Loading active={loading} />
            </button>
        );
    }

}

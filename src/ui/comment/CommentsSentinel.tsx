import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Loading } from "ui/control";
import "./CommentsSentinel.css";

interface Props {
    visible: boolean;
    loading: boolean;
    title: string;
    total: number;
    onBoundary: (intersecting: boolean) => void;
    onClick: () => void;
}

export default class CommentsSentinel extends React.PureComponent<Props> {

    boundaryObserver: IntersectionObserver;

    constructor(props: Props, context: any) {
        super(props, context);

        this.boundaryObserver = new IntersectionObserver(this.onBoundary);
    }

    observeSentinel = (sentinel: Element | null) => {
        if (sentinel == null) {
            this.boundaryObserver.disconnect();
        } else {
            this.boundaryObserver.observe(sentinel);
        }
    };

    onBoundary = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => this.props.onBoundary(entry.isIntersecting));
    }

    render() {
        const {visible, loading, title, total, onClick} = this.props;

        if (!visible) {
            return <div className="comments-sentinel"/>;
        }
        if (loading) {
            return (
                <div className="comments-sentinel">
                    <Loading active={loading}/>
                </div>
            );
        }
        const fullTitle = total > 0 ? `${title} (${total})` : title;
        return (
            <button className="btn btn-link comments-sentinel" ref={this.observeSentinel} onClick={onClick}>
                <FontAwesomeIcon className="icon" icon="sync-alt"/>&nbsp;&nbsp;{fullTitle}
            </button>
        );
    }

}

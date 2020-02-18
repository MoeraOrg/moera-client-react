import React from 'react';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { goToTimeline } from "state/navigation/actions";

class TimelineRewindButtons extends React.PureComponent {

    isAtTop() {
        if (this.props.before < Number.MAX_SAFE_INTEGER) {
            return false;
        }
        const postings = document.getElementsByClassName("posting");
        return postings.length > 0 && postings.item(0).getBoundingClientRect().top > 0;
    }

    isAtBottom() {
        if (this.props.after > Number.MIN_SAFE_INTEGER) {
            return false;
        }
        const postings = document.getElementsByClassName("posting");
        return postings.length > 0
            && postings.item(postings.length - 1).getBoundingClientRect().bottom < window.innerHeight;
    }

    toTop = e => {
        this.props.goToTimeline(Number.MAX_SAFE_INTEGER);
        e.preventDefault();
    };

    toBottom = e => {
        this.props.goToTimeline(Number.MIN_SAFE_INTEGER);
        e.preventDefault();
    };

    render() {
        return (
            <>
                <div className="timeline-btn">
                    <Button variant="outline-info" size="sm" invisible={this.isAtTop()} onClick={this.toTop}>
                        &#x23f6;&nbsp;Top
                    </Button>
                </div>
                <div className="timeline-btn">
                    <Button variant="outline-info" size="sm" invisible={this.isAtBottom()} onClick={this.toBottom}>
                        &#x23f7;&nbsp;Bottom
                    </Button>
                </div>
            </>
        );
    }

}

export default connect(
    state => ({
        before: state.timeline.before,
        after: state.timeline.after,
        at: state.timeline.at // to force re-rendering only
    }),
    { goToTimeline }
)(TimelineRewindButtons);

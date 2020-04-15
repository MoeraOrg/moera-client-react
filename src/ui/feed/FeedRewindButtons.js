import React from 'react';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { getFeedState } from "state/feeds/selectors";
import { feedScrollToAnchor } from "state/feeds/actions";

class FeedRewindButtons extends React.PureComponent {

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
        this.props.feedScrollToAnchor(this.props.feedName, Number.MAX_SAFE_INTEGER);
        e.preventDefault();
    };

    toBottom = e => {
        this.props.feedScrollToAnchor(this.props.feedName, Number.MIN_SAFE_INTEGER);
        e.preventDefault();
    };

    render() {
        return (
            <>
                <div className="feed-btn">
                    <Button variant="outline-info" size="sm" invisible={this.isAtTop()} onClick={this.toTop}>
                        &#x23f6;&nbsp;Top
                    </Button>
                </div>
                <div className="feed-btn">
                    <Button variant="outline-info" size="sm" invisible={this.isAtBottom()} onClick={this.toBottom}>
                        &#x23f7;&nbsp;Bottom
                    </Button>
                </div>
            </>
        );
    }

}

export default connect(
    (state, ownProps) => ({
        before: getFeedState(state, ownProps.feedName).before,
        after: getFeedState(state, ownProps.feedName).after,
        at: getFeedState(state, ownProps.feedName).at // to force re-rendering only
    }),
    { feedScrollToAnchor }
)(FeedRewindButtons);

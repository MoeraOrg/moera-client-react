import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';

import { Button } from "ui/control";
import { getFeedState } from "state/feeds/selectors";
import { feedScrollToAnchor } from "state/feeds/actions";

class FeedRewindButtons extends React.PureComponent {

    toTop = e => {
        this.props.feedScrollToAnchor(this.props.feedName, Number.MAX_SAFE_INTEGER);
        e.preventDefault();
    };

    toBottom = e => {
        this.props.feedScrollToAnchor(this.props.feedName, Number.MIN_SAFE_INTEGER);
        e.preventDefault();
    };

    render() {
        const {atTop, atBottom} = this.props;
        return (
            <>
                <div className="feed-btn">
                    <Button variant="outline-info" size="sm" invisible={atTop} onClick={this.toTop}>
                        &#x23f6;&nbsp;Top
                    </Button>
                </div>
                <div className="feed-btn">
                    <Button variant="outline-info" size="sm" invisible={atBottom} onClick={this.toBottom}>
                        &#x23f7;&nbsp;Bottom
                    </Button>
                </div>
            </>
        );
    }

}

FeedRewindButtons.propTypes = {
    atTop: PropType.bool,
    atBottom: PropType.bool
}

export default connect(
    (state, ownProps) => ({
        at: getFeedState(state, ownProps.feedName).at // to force re-rendering only
    }),
    { feedScrollToAnchor }
)(FeedRewindButtons);

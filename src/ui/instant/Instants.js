import React from 'react';
import { connect } from 'react-redux';

import { getFeedState } from "state/feeds/selectors";
import { feedPastSliceLoad, feedStatusUpdate } from "state/feeds/actions";
import InstantStory from "ui/instant/InstantStory";
import InstantsSentinel from "ui/instant/InstantsSentinel";
import "./Instants.css";

class Instants extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.pastIntersecting = true;
    }

    onSentinelPast = intersecting => {
        this.pastIntersecting = intersecting;
        if (this.pastIntersecting) {
            this.loadPast();
        }
    }

    loadPast = () => {
        if (this.props.loadingPast || this.props.after <= Number.MIN_SAFE_INTEGER) {
            return;
        }
        this.props.feedPastSliceLoad(":instant");
    }

    onReadAll = () => {
        const {stories, feedStatusUpdate} = this.props;

        if (stories == null || stories.length === 0) {
            return;
        }
        feedStatusUpdate(":instant", null, true, stories[0].moment);
    }

    render() {
        const {hide, loadingPast, after, stories} = this.props;

        return (
            <div id="instants">
                <div className="header">
                    <div className="title">Notifications</div>
                    <div className="read-all" onClick={this.onReadAll}>Mark All as Read</div>
                </div>
                <div className="content">
                    {stories
                        .map(story => <InstantStory key={story.moment} story={story} hide={hide}/>)
                    }
                </div>
                <InstantsSentinel loading={loadingPast} title="Load more..." margin="0px 0px 100px 0px"
                              visible={after > Number.MIN_SAFE_INTEGER} onSentinel={this.onSentinelPast}
                              onClick={this.loadPast}/>
            </div>
        );
    }

}

export default connect(
    (state) => ({
        loadingPast: getFeedState(state, ":instant").loadingPast,
        after: getFeedState(state, ":instant").after,
        stories: getFeedState(state, ":instant").stories
    }),
    { feedPastSliceLoad, feedStatusUpdate }
)(Instants);

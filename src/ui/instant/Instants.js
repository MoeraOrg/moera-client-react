import React from 'react';
import { connect } from 'react-redux';

import { getFeedState } from "state/feeds/selectors";
import { feedPastSliceLoad, feedStatusUpdate } from "state/feeds/actions";
import { confirmBox } from "state/confirmbox/actions";
import InstantStory from "ui/instant/InstantStory";
import InstantsSentinel from "ui/instant/InstantsSentinel";
import { BUILD_NUMBER } from "build-number";
import "./Instants.css";

class Instants extends React.PureComponent {

    #pastIntersecting = true;

    onSentinelPast = intersecting => {
        this.#pastIntersecting = intersecting;
        if (this.#pastIntersecting) {
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
        const {hide, loadingPast, after, stories, instantCount} = this.props;

        return (
            <div id="instants">
                <div className="header">
                    <div className="title">Notifications</div>
                    <div className="action" onClick={this.onReadAll}>Mark All as Read</div>
                </div>
                <div className="content">
                    {stories.map((story, i) =>
                        <InstantStory key={story.moment} story={story} hide={hide} lastNew={i + 1 === instantCount}/>
                    )}
                    <InstantsSentinel loading={loadingPast} title="Load more..." margin="0px 0px 100px 0px"
                                  visible={after > Number.MIN_SAFE_INTEGER} onSentinel={this.onSentinelPast}
                                  onClick={this.loadPast}/>
                </div>
                <div className="footer">
                    <div className="build-number">rev {BUILD_NUMBER}</div>
                </div>
            </div>
        );
    }

}

export default connect(
    state => ({
        loadingPast: getFeedState(state, ":instant").loadingPast,
        after: getFeedState(state, ":instant").after,
        stories: getFeedState(state, ":instant").stories
    }),
    { feedPastSliceLoad, feedStatusUpdate, confirmBox }
)(Instants);

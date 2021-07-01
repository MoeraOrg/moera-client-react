import React from 'react';
import { connect } from 'react-redux';

import { Popover } from "ui/control";
import InstantBell from "ui/instant/InstantBell";
import Instants from "ui/instant/Instants";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedNotViewed, getFeedState, getInstantCount } from "state/feeds/selectors";

class InstantButton extends React.PureComponent {

    state = {
        instantCount: 0
    };
    #visible = false;
    #topMoment = Number.MIN_SAFE_INTEGER;

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.viewAll();
    }

    onToggle = visible => {
        if (visible && this.#visible !== visible) {
            this.setState({instantCount: this.props.instantCount});
        }
        this.#visible = visible;
        this.viewAll();
    }

    viewAll() {
        const {stories, notViewedCount, feedStatusUpdate} = this.props;

        if (!this.#visible || stories == null || stories.length === 0 || notViewedCount === 0
            || this.#topMoment === stories[0].moment) {

            return;
        }
        this.#topMoment = stories[0].moment;
        feedStatusUpdate(":instant", true, null, this.#topMoment);
    }

    render() {
        return (
            <Popover element={InstantBell} className="instant-popover" detached={true} onToggle={this.onToggle}>
                {({hide}) => (
                    <Instants hide={hide} instantCount={this.state.instantCount}/>
                )}
            </Popover>
        );
    }

}

export default connect(
    state => ({
        stories: getFeedState(state, ":instant").stories,
        notViewedCount: getFeedNotViewed(state, ":instant"),
        instantCount: getInstantCount(state)
    }),
    { feedStatusUpdate }
)(InstantButton);

import React from 'react';
import { connect } from 'react-redux';

import { Popover } from "ui/control";
import InstantBell from "ui/mainmenu/connectionstatus/InstantBell";
import Instants from "ui/instant/Instants";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedState } from "state/feeds/selectors";

class InstantButton extends React.PureComponent {

    onToggle = (visible) => {
        const {stories, feedStatusUpdate} = this.props;

        if (!visible || stories == null || stories.length === 0 || stories[0].viewed) {
            return;
        }
        feedStatusUpdate(":instant", true, null, stories[0].moment);
    }

    render() {
        return (
            <Popover element={InstantBell} onToggle={this.onToggle}>
                {({hide, update}) => (
                    <Instants hide={hide} update={update}/>
                )}
            </Popover>
        );
    }

}

export default connect(
    state => ({
        stories: getFeedState(state, ":instant").stories
    }),
    { feedStatusUpdate }
)(InstantButton);

import React from 'react';
import { connect } from 'react-redux';

import { goToLocation } from "state/navigation/actions";
import { getFeedState } from "state/feeds/selectors";

class Navigation extends React.PureComponent {

    componentDidMount() {
        window.onpopstate = this.popState;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {rootPage, location, title, update, locked, count} = this.props;

        if (!locked && location !== prevProps.location) {
            if (update) {
                window.history.pushState({location}, "", rootPage + location);
            } else {
                window.history.replaceState({location}, "", rootPage + location);
            }
        }
        if (title !== prevProps.title || count !== prevProps.count) {
            const counter = count > 0 ? `(${count}) ` : "";
            if (title) {
                document.title = counter + title + " | Moera";
            } else {
                document.title = counter + "Moera";
            }
        }
    }

    popState = event => {
        this.props.goToLocation(window.location.pathname, window.location.search, window.location.hash);
        event.preventDefault();
    };

    render() {
        return null;
    }

}

export default connect(
    state => ({
        rootPage: state.node.root.page,
        location: state.navigation.location,
        title: state.navigation.title,
        update: state.navigation.update,
        locked: state.navigation.locked,
        count: getFeedState(state, ":instant").notViewed
    }),
    { goToLocation }
)(Navigation);

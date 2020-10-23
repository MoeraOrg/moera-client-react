import React from 'react';
import { connect } from 'react-redux';

import { goToLocation } from "state/navigation/actions";
import { getInstantCount } from "state/feeds/selectors";
import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "api";

class Navigation extends React.PureComponent {

    componentDidMount() {
        window.onpopstate = this.popState;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {standalone, rootPage, location, title, update, locked, count} = this.props;

        if (!locked && location !== prevProps.location) {
            const data = !standalone ? {location} : {location: rootPage + location};
            const url = !standalone ? rootPage + location : Browser.passedLocation(rootPage + location);
            if (update) {
                window.history.pushState(data, "", url);
            } else {
                window.history.replaceState(data, "", url);
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
        const {standalone, goToLocation} = this.props;

        if (!standalone) {
            goToLocation(window.location.pathname, window.location.search, window.location.hash);
        } else {
            const {path, query, hash} = Browser.getDocumentPassedLocation();
            goToLocation(path, query, hash);
        }
        event.preventDefault();
    };

    render() {
        return null;
    }

}

export default connect(
    state => ({
        standalone: isStandaloneMode(state),
        rootPage: state.node.root.page,
        location: state.navigation.location,
        title: state.navigation.title,
        update: state.navigation.update,
        locked: state.navigation.locked,
        count: getInstantCount(state)
    }),
    { goToLocation }
)(Navigation);

import React from 'react';
import { connect } from 'react-redux';

import { goToLocation, initFromLocation } from "state/navigation/actions";
import { getInstantCount } from "state/feeds/selectors";
import { isStandaloneMode } from "state/navigation/selectors";
import { getNodeRootLocation, getNodeRootPage } from "state/node/selectors";
import { Browser } from "ui/browser";

class Navigation extends React.PureComponent {

    #rootPage;
    #location;

    componentDidMount() {
        window.onpopstate = this.popState;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {standalone, rootPage, location, title, update, locked, count} = this.props;

        if (!locked
            && (rootPage !== this.#rootPage || location !== this.#location)
            && rootPage != null && location != null) {

            const data = !standalone ? {location} : {location: rootPage + location};
            const url = !standalone ? rootPage + location : Browser.passedLocation(rootPage + location);
            if (update) {
                window.history.pushState(data, "", url);
            } else {
                window.history.replaceState(data, "", url);
            }
            if (window.Android) {
                window.Android.locationChanged(url, location);
            }
            this.#rootPage = rootPage;
            this.#location = location;
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
        const {standalone, rootLocation, initFromLocation, goToLocation} = this.props;

        if (!standalone) {
            goToLocation(window.location.pathname, window.location.search, window.location.hash);
        } else {
            const {rootLocation: root, path, query, hash} = Browser.getDocumentPassedLocation();
            if (root === rootLocation) {
                goToLocation(path, query, hash);
            } else {
                initFromLocation(root, path, query, hash);
            }
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
        rootLocation: getNodeRootLocation(state),
        rootPage: getNodeRootPage(state),
        location: state.navigation.location,
        title: state.navigation.title,
        update: state.navigation.update,
        locked: state.navigation.locked,
        count: getInstantCount(state)
    }),
    { initFromLocation, goToLocation }
)(Navigation);

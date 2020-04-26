import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import * as URI from 'uri-js';

import { goToLocation } from "state/navigation/actions";
import { getOwnerName } from "state/owner/selectors";
import { getNamingNameDetails } from "state/naming/selectors";
import { getHomeOwnerName } from "state/home/selectors";
import { urlWithParameters } from "util/misc";

class Jump extends React.PureComponent {

    static propTypes = {
        nodeName: PropType.string,
        href: PropType.string,
        className: PropType.string,
        onNear: PropType.func,
        onFar: PropType.func
    }

    onNear = e => {
        const {href, onNear, goToLocation} = this.props;
        const performJump = () => {
            const {path, query, hash} = URI.parse(href);
            goToLocation(path, query, hash);
        }
        if (onNear != null) {
            onNear(href, performJump);
        } else {
            performJump();
        }
        e.preventDefault();
    }

    onFar = url => e => {
        const {onFar} = this.props;
        const performJump = () => {
            window.location = url;
        }
        if (onFar != null) {
            onFar(url, performJump);
        } else {
            performJump();
        }
        e.preventDefault();
    }

    render() {
        const {nodeName, href, className, title, ownerName, rootPage, homeOwnerName, homeRootPage, details,
            children} = this.props;

        if (nodeName == null || nodeName === ownerName || (nodeName === ":" && homeOwnerName === ownerName)) {
            return <a href={rootPage + href} className={className} title={title} onClick={this.onNear}>{children}</a>
        } else {
            let url;
            if (nodeName === ":" || nodeName === homeOwnerName) {
                url = homeRootPage + href;
            } else {
                url = details.loaded
                    ? details.nodeUri + href
                    : urlWithParameters(homeRootPage + "/gotoname", {nodeName, location: href});
            }
            return <a href={url} className={className} title={title} onClick={this.onFar(url)}>{children}</a>
        }
    }

}

export default connect(
    (state, ownProps) => ({
        ownerName: getOwnerName(state),
        rootPage: state.node.root.page,
        homeOwnerName: getHomeOwnerName(state),
        homeRootPage: state.home.root.page,
        details: getNamingNameDetails(state, ownProps.nodeName)
    }),
    { goToLocation }
)(Jump);

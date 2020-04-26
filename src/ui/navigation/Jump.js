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
        className: PropType.string
    }

    onClick = e => {
        const {path, query, hash} = URI.parse(this.props.href);
        this.props.goToLocation(path, query, hash);
        e.preventDefault();
    }

    render() {
        const {nodeName, href, className, ownerName, rootPage, homeOwnerName, homeRootPage, details, children} = this.props;

        if (nodeName == null || nodeName === ownerName) {
            return <a href={rootPage + href} className={className} onClick={this.onClick}>{children}</a>
        } else if (nodeName === homeOwnerName) {
            return <a href={homeRootPage + href} className={className}>{children}</a>
        } else {
            const url = details.loaded
                ? details.nodeUri + href
                : urlWithParameters(homeRootPage + "/gotoname", {nodeName, location: href});
            return <a href={url} className={className}>{children}</a>
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

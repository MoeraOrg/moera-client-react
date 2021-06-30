import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import * as URI from 'uri-js';

import { goToLocation, initFromLocation } from "state/navigation/actions";
import { getOwnerName } from "state/owner/selectors";
import { getNamingNameDetails } from "state/naming/selectors";
import { getHomeOwnerName, getHomeRootPage } from "state/home/selectors";
import { isStandaloneMode } from "state/navigation/selectors";
import { redirectUrl, rootUrl } from "util/url";
import { getNodeRootPage } from "state/node/selectors";

class Jump extends React.PureComponent {

    static propTypes = {
        nodeName: PropType.string,
        nodeUri: PropType.string,
        href: PropType.string,
        className: PropType.string,
        title: PropType.string,
        trackingId: PropType.string,
        onNear: PropType.func,
        onFar: PropType.func,
        anchorRef: PropType.any,
        onMouseEnter: PropType.func,
        onMouseLeave: PropType.func,
        onTouchStart: PropType.func
    }

    onNear = e => {
        const {href, onNear, goToLocation} = this.props;

        if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.altKey) {
            return;
        }

        const performJump = () => {
            const {path, query, fragment} = URI.parse(href);
            goToLocation(path, query, fragment);
        }
        if (onNear != null) {
            onNear(href, performJump);
        } else {
            performJump();
        }
        e.preventDefault();
    }

    onFar = (url, nodeLocation, location) => e => {
        const {standalone, onFar, initFromLocation} = this.props;

        if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.altKey) {
            return;
        }

        const performJump = () => {
            if (!standalone || nodeLocation == null) {
                window.location = url;
            } else {
                const {scheme, host, port} = URI.parse(nodeLocation);
                const rootLocation = rootUrl(scheme, host, port);
                const {path, query, fragment} = URI.parse(location);
                initFromLocation(rootLocation, path, query, fragment);
            }
        }
        if (onFar != null) {
            onFar(url, performJump);
        } else {
            performJump();
        }
        e.preventDefault();
    }

    render() {
        const {
            standalone, nodeName, nodeUri, href, className, title, ownerName, rootPage, homeOwnerName, homeRootPage,
            details, trackingId, anchorRef, onMouseEnter, onMouseLeave, onTouchStart, children
        } = this.props;

        const redirectPage = homeRootPage ?? rootPage;
        const nodeOwnerName = nodeName ? (nodeName === ":" ? homeOwnerName : nodeName) : ownerName;
        if (nodeOwnerName === ownerName) {
            const nodeLocation = rootPage ?? nodeUri;
            const url = redirectUrl(standalone, redirectPage, ownerName, nodeLocation, href, trackingId);
            return <a href={url} className={className} title={title} data-nodename={nodeOwnerName} data-href={href}
                      ref={anchorRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                      onTouchStart={onTouchStart} onClick={this.onNear} suppressHydrationWarning={true}>{children}</a>;
        } else {
            let nodeLocation;
            if (nodeOwnerName === homeOwnerName) {
                nodeLocation = homeRootPage ?? nodeUri;
            } else if (details.loaded) {
                nodeLocation = details.nodeUri;
            } else {
                nodeLocation = nodeUri;
            }
            const url = redirectUrl(standalone, redirectPage, nodeOwnerName, nodeLocation, href, trackingId);
            return <a href={url} className={className} title={title} data-nodename={nodeOwnerName} data-href={href}
                      ref={anchorRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                      onTouchStart={onTouchStart} onClick={this.onFar(url, nodeLocation, href)}
                      suppressHydrationWarning={true}>{children}</a>;
        }
    }

}

export default connect(
    (state, ownProps) => ({
        standalone: isStandaloneMode(state),
        ownerName: getOwnerName(state),
        rootPage: getNodeRootPage(state),
        homeOwnerName: getHomeOwnerName(state),
        homeRootPage: getHomeRootPage(state),
        details: getNamingNameDetails(state, ownProps.nodeName)
    }),
    { initFromLocation, goToLocation }
)(Jump);

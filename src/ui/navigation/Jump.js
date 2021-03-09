import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import * as URI from 'uri-js';

import { goToLocation, initFromLocation } from "state/navigation/actions";
import { getOwnerName } from "state/owner/selectors";
import { getNamingNameDetails } from "state/naming/selectors";
import { getHomeOwnerName, getHomeRootPage } from "state/home/selectors";
import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "ui/browser";
import { rootUrl, urlWithParameters } from "util/url";
import { getNodeRootPage } from "state/node/selectors";

class Jump extends React.PureComponent {

    static propTypes = {
        nodeName: PropType.string,
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

    track(url) {
        const {standalone, trackingId, homeRootPage} = this.props;

        if (standalone) {
            url = Browser.passedLocation(url);
        }
        return trackingId != null
            ? urlWithParameters(homeRootPage + "/track", {trackingId, href: url}) : url;
    }

    render() {
        const {
            standalone, nodeName, href, className, title, ownerName, rootPage, homeOwnerName, homeRootPage, details,
            trackingId, anchorRef, onMouseEnter, onMouseLeave, onTouchStart, children
        } = this.props;

        const dataNodeName = nodeName ? (nodeName === ":" ? homeOwnerName : nodeName) : ownerName;
        if (nodeName == null || nodeName === ownerName || (nodeName === ":" && homeOwnerName === ownerName)) {
            return <a href={this.track(rootPage + href)} className={className} title={title}
                      data-nodename={dataNodeName} data-href={href} ref={anchorRef} onMouseEnter={onMouseEnter}
                      onMouseLeave={onMouseLeave} onTouchStart={onTouchStart} onClick={this.onNear}
                      suppressHydrationWarning={true}>{children}</a>;
        } else {
            let url, nodeLocation = null;
            if (nodeName === ":" || nodeName === homeOwnerName) {
                nodeLocation = homeRootPage;
                url = this.track(nodeLocation + href);
            } else {
                const client = standalone ? Browser.getRootLocation() : null;
                if (details.loaded && false) {
                    nodeLocation = details.nodeUri;
                    url = this.track(nodeLocation + href);
                } else {
                    url = urlWithParameters(homeRootPage + "/gotoname",
                        {client, name: nodeName, location: href, trackingId});
                    console.log(homeRootPage, url, client, href, trackingId);
                }
            }
            return <a href={url} className={className} title={title} data-nodename={dataNodeName} data-href={href}
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

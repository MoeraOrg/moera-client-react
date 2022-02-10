import React, { MouseEventHandler, TouchEventHandler } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import * as URI from 'uri-js';

import { goToLocation, initFromLocation, initFromNodeLocation } from "state/navigation/actions";
import { getOwnerName } from "state/owner/selectors";
import { getNamingNameDetails } from "state/naming/selectors";
import { getHomeOwnerName, getHomeRootPage } from "state/home/selectors";
import { isStandaloneMode } from "state/navigation/selectors";
import { getNodeRootPage } from "state/node/selectors";
import { ClientState } from "state/state";
import { redirectUrl, rootUrl } from "util/url";

interface OwnProps {
    nodeName?: string | null;
    nodeUri?: string | null;
    href: string;
    className?: string;
    style?: React.CSSProperties;
    title?: string;
    trackingId?: string | null;
    onNear?: (href: string, callback: () => void) => void | null;
    onFar?: (href: string, callback: () => void) => void | null;
    anchorRef?: React.Ref<HTMLAnchorElement> | null,
    onMouseEnter?: MouseEventHandler<HTMLAnchorElement>,
    onMouseLeave?: MouseEventHandler<HTMLAnchorElement>,
    onTouchStart?: TouchEventHandler<HTMLAnchorElement>,
    children?: any;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

class Jump extends React.PureComponent<Props> {

    onNear = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const {href, onNear, goToLocation} = this.props;

        if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.altKey) {
            return;
        }

        const performJump = () => {
            const {path = null, query = null, fragment = null} = URI.parse(href);
            goToLocation(path, query, fragment);
        }
        if (onNear != null) {
            onNear(href, performJump);
        } else {
            performJump();
        }
        e.preventDefault();
    }

    onFar = (url: string, nodeLocation: string | null, nodeOwnerName: string | null, location: string) =>
            (e: React.MouseEvent) => {
        const {standalone, onFar, initFromNodeLocation, initFromLocation} = this.props;

        if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.altKey) {
            return;
        }

        const performJump = () => {
            if (!standalone || nodeOwnerName == null) {
                window.location.href = url;
            } else if (nodeLocation == null) {
                initFromNodeLocation(nodeOwnerName, location, url);
            } else {
                const {scheme, host, port} = URI.parse(nodeLocation);
                if (scheme != null && host != null) {
                    const rootLocation = rootUrl(scheme, host, port);
                    const {path = null, query = null, fragment = null} = URI.parse(location);
                    initFromLocation(rootLocation, path, query, fragment);
                }
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
            standalone, nodeName, nodeUri, href, className, style, title, ownerName, rootPage, homeOwnerName,
            homeRootPage, details, trackingId, anchorRef, onMouseEnter, onMouseLeave, onTouchStart, children
        } = this.props;

        const redirectPage = homeRootPage ?? rootPage ?? "unknown";
        const nodeOwnerName = nodeName ? (nodeName === ":" ? homeOwnerName : nodeName) : ownerName;
        if (nodeOwnerName === ownerName) {
            const nodeLocation = rootPage ?? nodeUri ?? "unknown";
            const url = redirectUrl(standalone, redirectPage, ownerName, nodeLocation, href, trackingId);
            return <a href={url} className={className} style={style} title={title} data-nodename={nodeOwnerName}
                      data-href={href} ref={anchorRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                      onTouchStart={onTouchStart} onClick={this.onNear} suppressHydrationWarning>{children}</a>;
        } else {
            let nodeLocation;
            if (nodeOwnerName === homeOwnerName) {
                nodeLocation = homeRootPage ?? nodeUri;
            } else if (details.loaded) {
                nodeLocation = details.nodeUri;
            } else {
                nodeLocation = nodeUri;
            }
            nodeLocation ??= null;
            const url = redirectUrl(standalone, redirectPage, nodeOwnerName, nodeLocation, href, trackingId);
            return <a href={url} className={className} style={style} title={title} data-nodename={nodeOwnerName}
                      data-href={href} ref={anchorRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                      onTouchStart={onTouchStart} onClick={this.onFar(url, nodeLocation, nodeOwnerName, href)}
                      suppressHydrationWarning>{children}</a>;
        }
    }

}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        standalone: isStandaloneMode(state),
        ownerName: getOwnerName(state),
        rootPage: getNodeRootPage(state),
        homeOwnerName: getHomeOwnerName(state),
        homeRootPage: getHomeRootPage(state),
        details: getNamingNameDetails(state, ownProps.nodeName)
    }),
    { initFromNodeLocation, initFromLocation, goToLocation }
);

export default connector(Jump);

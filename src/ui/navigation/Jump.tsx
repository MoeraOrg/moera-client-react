import React, { ForwardedRef, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as URI from 'uri-js';

import { ClientState } from "state/state";
import { getNamingNameDetails } from "state/naming/selectors";
import { getHomeOwnerName, getHomeRootPage } from "state/home/selectors";
import { getNodeRootPage, getOwnerName } from "state/node/selectors";
import { goToLocation, initFromLocation, initFromNodeLocation } from "state/navigation/actions";
import * as Browser from "ui/browser";
import { rootUrl } from "util/url";

export type JumpCallback = (href: string, callback: () => void) => void | null;

interface Props {
    nodeName?: string | null;
    nodeUri?: string | null;
    href: string;
    className?: string;
    style?: React.CSSProperties;
    title?: string;
    trackingId?: string | null;
    onNear?: JumpCallback;
    onFar?: JumpCallback;
    children?: any;
}

function Jump(
    {nodeName, nodeUri, href, className, style, title, trackingId, onNear, onFar, children}: Props,
    ref: ForwardedRef<HTMLAnchorElement>
) {
    const ownerName = useSelector(getOwnerName);
    const rootPage = useSelector(getNodeRootPage);
    const homeOwnerName = useSelector(getHomeOwnerName);
    const homeRootPage = useSelector(getHomeRootPage);
    const details = useSelector((state: ClientState) => getNamingNameDetails(state, nodeName));
    const dispatch = useDispatch();

    const onNearClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.altKey) {
            return;
        }

        const performJump = () => {
            const {path = null, query = null, fragment = null} = URI.parse(href);
            dispatch(goToLocation(path, query, fragment));
        }
        if (onNear != null) {
            onNear(href, performJump);
        } else {
            performJump();
        }
        e.preventDefault();
    }

    const onFarClick = (
        url: string, nodeLocation: string | null, nodeOwnerName: string | null
    ) => (e: React.MouseEvent) => {
        if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.altKey) {
            return;
        }

        const performJump = () => {
            if (nodeOwnerName == null) {
                return;
            } else if (nodeLocation == null) {
                const {path = null, query = null, fragment = null} = URI.parse(href);
                dispatch(initFromNodeLocation(nodeOwnerName, path, query, fragment, url));
            } else {
                const {scheme, host, port} = URI.parse(nodeLocation);
                if (scheme != null && host != null) {
                    const rootLocation = rootUrl(scheme, host, port);
                    const {path = null, query = null, fragment = null} = URI.parse(href);
                    dispatch(initFromLocation(nodeOwnerName, rootLocation, path, query, fragment));
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

    const nodeOwnerName = nodeName ? (nodeName === ":" ? homeOwnerName : nodeName) : ownerName;
    if (nodeOwnerName === ownerName) {
        const nodeLocation = rootPage ?? nodeUri ?? "unknown";
        const url = Browser.universalLocation(ownerName, nodeLocation, href, trackingId);
        return <a href={url} className={className} style={style} title={title} data-nodename={nodeOwnerName}
                  data-href={href} ref={ref} onClick={onNearClick} suppressHydrationWarning>{children}</a>;
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
        const url = Browser.universalLocation(nodeOwnerName, nodeLocation, href, trackingId);
        return <a href={url} className={className} style={style} title={title} data-nodename={nodeOwnerName}
                  data-href={href} ref={ref} onClick={onFarClick(url, nodeLocation, nodeOwnerName)}
                  suppressHydrationWarning>{children}</a>;
    }
}

export default forwardRef(Jump);

import React, { MouseEventHandler, TouchEventHandler } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as URI from 'uri-js';

import { ClientState } from "state/state";
import { getNamingNameDetails } from "state/naming/selectors";
import { getHomeOwnerName, getHomeRootPage } from "state/home/selectors";
import { getNodeRootPage, getOwnerName } from "state/node/selectors";
import { goToLocation, initFromLocation, initFromNodeLocation } from "state/navigation/actions";
import { redirectUrl, rootUrl } from "util/url";

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
    anchorRef?: React.Ref<HTMLAnchorElement> | null,
    onMouseEnter?: MouseEventHandler<HTMLAnchorElement>,
    onMouseLeave?: MouseEventHandler<HTMLAnchorElement>,
    onTouchStart?: TouchEventHandler<HTMLAnchorElement>,
    children?: any;
}

export default function Jump({
    nodeName, nodeUri, href, className, style, title, trackingId, onNear, onFar, anchorRef, onMouseEnter, onMouseLeave,
    onTouchStart, children
}: Props) {
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
                dispatch(initFromNodeLocation(nodeOwnerName, href, url));
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

    const redirectPage = homeRootPage ?? rootPage ?? "unknown";
    const nodeOwnerName = nodeName ? (nodeName === ":" ? homeOwnerName : nodeName) : ownerName;
    if (nodeOwnerName === ownerName) {
        const nodeLocation = rootPage ?? nodeUri ?? "unknown";
        const url = redirectUrl(true, redirectPage, ownerName, nodeLocation, href, trackingId);
        return <a href={url} className={className} style={style} title={title} data-nodename={nodeOwnerName}
                  data-href={href} ref={anchorRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                  onTouchStart={onTouchStart} onClick={onNearClick} suppressHydrationWarning>{children}</a>;
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
        const url = redirectUrl(true, redirectPage, nodeOwnerName, nodeLocation, href, trackingId);
        return <a href={url} className={className} style={style} title={title} data-nodename={nodeOwnerName}
                  data-href={href} ref={anchorRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
                  onTouchStart={onTouchStart} onClick={onFarClick(url, nodeLocation, nodeOwnerName)}
                  suppressHydrationWarning>{children}</a>;
    }
}

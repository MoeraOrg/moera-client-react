import React, { ForwardedRef, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as URI from 'uri-js';

import { ClientState } from "state/state";
import { getNamingNameDetails } from "state/naming/selectors";
import { getHomeOwnerNameOrUrl, getHomeRootPage } from "state/home/selectors";
import { getNodeRootPage, getOwnerNameOrUrl } from "state/node/selectors";
import { goToLocation, initFromLocation, initFromNodeLocation } from "state/navigation/actions";
import { getSearchNodeName } from "state/search/selectors";
import * as Browser from "ui/browser";
import { rootUrl } from "util/url";
import { absoluteNodeName, REL_CURRENT, RelNodeName } from "util/rel-node-name";
import { universalLocation } from "util/universal-url";

export type JumpCallback = (href: string, performJump: () => void) => void | null;

interface Props {
    nodeName?: RelNodeName | string;
    nodeUri?: string | null;
    href: string;
    id?: string;
    dataIndex?: string | number | null;
    className?: string;
    style?: React.CSSProperties;
    title?: string;
    readId?: string | null;
    onNear?: JumpCallback;
    onFar?: JumpCallback;
    children?: any;
}

function Jump(
    {
        nodeName = REL_CURRENT, nodeUri, href, id, dataIndex, className, style, title, readId, onNear, onFar, children
    }: Props,
    ref: ForwardedRef<HTMLAnchorElement>
) {
    const ownerNameOrUrl = useSelector(getOwnerNameOrUrl);
    const rootPage = useSelector(getNodeRootPage);
    const homeOwnerNameOrUrl = useSelector(getHomeOwnerNameOrUrl);
    const homeRootPage = useSelector(getHomeRootPage);
    const searchName = useSelector(getSearchNodeName);
    const nodeOwnerName = absoluteNodeName(nodeName, {ownerNameOrUrl, homeOwnerNameOrUrl, searchName});
    const details = useSelector((state: ClientState) => getNamingNameDetails(state, nodeOwnerName));
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

    if (nodeOwnerName === ownerNameOrUrl) {
        const nodeLocation = rootPage ?? nodeUri;
        const url = universalLocation(Browser.getRootLocation(), ownerNameOrUrl, nodeLocation, href, readId);
        return (
            <a
                href={url}
                id={id}
                className={className}
                style={style}
                title={title}
                data-nodename={nodeOwnerName}
                data-href={href}
                data-index={dataIndex ?? undefined}
                ref={ref}
                onClick={onNearClick}
                suppressHydrationWarning
            >
                {children}
            </a>
        );
    } else {
        let nodeLocation;
        if (nodeOwnerName === homeOwnerNameOrUrl) {
            nodeLocation = homeRootPage ?? nodeUri;
        } else if (details.loaded) {
            nodeLocation = details.nodeUri;
        } else {
            nodeLocation = nodeUri;
        }
        nodeLocation ??= null;
        const url = universalLocation(null, nodeOwnerName, nodeLocation, href, readId);
        return (
            <a
                href={url}
                id={id}
                className={className}
                style={style}
                title={title}
                data-nodename={nodeOwnerName}
                data-href={href}
                data-index={dataIndex ?? undefined}
                ref={ref}
                onClick={onFarClick(url, nodeLocation, nodeOwnerName)}
                suppressHydrationWarning
            >
                {children}
            </a>
        );
    }
}

export default forwardRef(Jump);

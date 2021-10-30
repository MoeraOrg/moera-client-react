import React, { Suspense, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { connect, ConnectedProps, Provider } from 'react-redux';
import * as URI from 'uri-js';
import 'katex/dist/katex.min.css';

import { MediaAttachment, PrivateMediaFileInfo } from "api/node/api-types";
import { ClientState } from "state/state";
import store from "state/store";
import { getSetting } from "state/settings/selectors";
import NodeNameMention from "ui/nodename/NodeNameMention";
import Jump from "ui/navigation/Jump";
import EntryImage from "ui/posting/EntryImage";
import { isStandaloneMode } from "state/navigation/selectors";
import { goToLocation, initFromLocation } from "state/navigation/actions";
import { Browser } from "ui/browser";
import { rootUrl } from "util/url";

const InlineMath = React.lazy(() => import("ui/katex/InlineMath"));
const BlockMath = React.lazy(() => import("ui/katex/BlockMath"));

type Props = {
    className?: string;
    postingId?: string | null;
    html: string | null | undefined;
    media?: MediaAttachment[] | null;
    onClick?: (event: React.MouseEvent) => void;
} & ConnectedProps<typeof connector>;

function EntryHtml({className, postingId, html, media, onClick, standalone, fontMagnitude,
                    initFromLocation, goToLocation}: Props) {
    const dom = useRef<HTMLDivElement>(null);
    const mediaMap: Map<string, PrivateMediaFileInfo> = new Map((media ?? []).map(mf => [mf.media.hash, mf.media]));

    const hydrate = () => {
        if (dom.current == null) {
            return;
        }

        dom.current.querySelectorAll("a[data-nodename]").forEach(node => {
            const name = node.getAttribute("data-nodename");
            const href = node.getAttribute("data-href");

            const span = document.createElement("span");
            node.replaceWith(span);

            if (!href || href === "/") {
                span.appendChild(node);

                const text = (node as HTMLElement).innerText;
                const fullName = text.startsWith("@") ? text.substring(1) : text;
                ReactDOM.render(
                    <Provider store={store}>
                        <NodeNameMention name={name} fullName={fullName} text={text}/>
                    </Provider>, span);
            } else {
                const html = node.innerHTML;
                ReactDOM.render(
                    <Provider store={store}>
                        <Jump nodeName={name} href={href}><span dangerouslySetInnerHTML={{__html: html}}/></Jump>
                    </Provider>, span);
            }
        });
        dom.current.querySelectorAll("img").forEach(node => {
            const src = node.getAttribute("src");
            const mediaFile = src != null && src.startsWith("hash:") ? mediaMap.get(src.substring(5)) : null;
            if (mediaFile != null) {
                const width = node.getAttribute("width");
                const height = node.getAttribute("height");
                const alt = node.getAttribute("alt");
                const title = node.getAttribute("title");

                const span = document.createElement("span");
                node.replaceWith(span);

                ReactDOM.render(
                    <Provider store={store}>
                        <EntryImage postingId={postingId} mediaFile={mediaFile} width={width} height={height}
                                    alt={alt} title={title}/>
                    </Provider>, span);
            }
        });
        dom.current.querySelectorAll("span.katex").forEach(node => {
            ReactDOM.render(
                <Suspense fallback={<>Loading math...</>}>
                    <InlineMath math={(node as HTMLElement).innerText}/>
                </Suspense>, node);
        });
        dom.current.querySelectorAll("div.katex").forEach(node => {
            ReactDOM.render(
                <Suspense fallback={<>Loading math...</>}>
                    <BlockMath math={(node as HTMLElement).innerText}/>
                </Suspense>, node);
        });
    }

    const onClickLink = (event: MouseEvent) => {
        if (event.target == null) {
            return;
        }
        const href = (event.target as HTMLElement).getAttribute("href");
        if (!href) {
            return;
        }
        const parts = URI.parse(URI.normalize(href));
        if (parts.scheme !== "https" || parts.host == null) {
            return;
        }
        fetch(URI.serialize(parts), {
            method: "GET",
            headers: {
                "X-Accept-Moera": "1.0"
            },
            referrerPolicy: "no-referrer"
        }).then(response => {
            const headers = response.headers;
            if (headers && headers.has("X-Moera")) {
                const rootPage = rootUrl(parts.scheme!, parts.host!, parts.port);
                const {rootLocation, path = null, query = null, hash = null} =
                    Browser.getLocation(rootPage, parts.path, parts.query, parts.fragment, headers.get("X-Moera"));
                if (rootLocation != null && rootLocation !== Browser.getRootLocation()) {
                    initFromLocation(rootLocation, path, query, hash);
                } else {
                    goToLocation(path, query, hash);
                }
            } else {
                window.location.href = href;
            }
        }).catch(() => {
            window.location.href = href;
        });
        event.preventDefault();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => hydrate(), [html]);

    useEffect(() => {
        const root = dom.current;

        if (!standalone || root == null) {
            return;
        }

        root.querySelectorAll("a").forEach(node => {
            const name = node.getAttribute("data-nodename");
            if (!name) {
                node.addEventListener("click", onClickLink);
            }
        });

        return () => {
            root.querySelectorAll("a").forEach(node => {
                const name = node.getAttribute("data-nodename");
                if (!name) {
                    node.removeEventListener("click", onClickLink);
                }
            });
        }
    });

    return <div ref={dom} className={className} style={{fontSize: `${fontMagnitude}%`}} onClick={onClick}
                dangerouslySetInnerHTML={{__html: html ?? ""}}/>
}

const connector = connect(
    (state: ClientState) => ({
        standalone: isStandaloneMode(state),
        fontMagnitude: getSetting(state, "posting.body.font-magnitude") as number
    }),
    { initFromLocation, goToLocation }
);

export default connector(EntryHtml);

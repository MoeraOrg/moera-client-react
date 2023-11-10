import React, { Suspense, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { connect, ConnectedProps, Provider } from 'react-redux';
import 'katex/dist/katex.min.css';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { ClientState } from "state/state";
import store from "state/store";
import { getPostingBodyFontMagnitude } from "state/settings/selectors";
import { goToLocation, initFromLocation, newLocation } from "state/navigation/actions";
import NodeNameMention from "ui/nodename/NodeNameMention";
import Jump from "ui/navigation/Jump";
import EntryImage from "ui/entry/EntryImage";
import { interceptLinkClick } from "ui/entry/link-click-intercept";
import MrSpoiler from "ui/entry/MrSpoiler";
import { isNumericString } from "util/misc";

const InlineMath = React.lazy(() => import("ui/katex/InlineMath"));
const BlockMath = React.lazy(() => import("ui/katex/BlockMath"));

type Props = {
    className?: string;
    postingId?: string | null;
    commentId?: string | null;
    html: string | null | undefined;
    nodeName?: string | null;
    media?: MediaAttachment[] | null;
    onClick?: (event: React.MouseEvent) => void;
} & ConnectedProps<typeof connector>;

function EntryHtml({
    className, postingId, commentId, html, nodeName, media, onClick, fontMagnitude, initFromLocation, goToLocation,
    newLocation
}: Props) {
    const dom = useRef<HTMLDivElement>(null);
    const mediaMap: Map<string, PrivateMediaFileInfo> = new Map(
        (media ?? [])
            .map(ma => ma.media)
            .filter((mf): mf is PrivateMediaFileInfo => mf != null)
            .map(mf => [mf.hash, mf])
    );

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
                createRoot(span).render(
                    <Provider store={store}>
                        <NodeNameMention name={name} fullName={fullName} text={text}/>
                    </Provider>
                );
            } else {
                const html = node.innerHTML;
                createRoot(span).render(
                    <Provider store={store}>
                        <Jump nodeName={name} href={href}><span dangerouslySetInnerHTML={{__html: html}}/></Jump>
                    </Provider>
                );
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

                createRoot(span).render(
                    <Provider store={store}>
                        <EntryImage postingId={postingId} commentId={commentId} nodeName={nodeName ?? null}
                                    mediaFile={mediaFile} width={width} height={height} alt={alt} title={title}/>
                    </Provider>
                );
            } else {
                const width = node.getAttribute("width");
                const height = node.getAttribute("height");
                let style = node.getAttribute("style") ?? "";
                if (isNumericString(width)) {
                    style += `; --width: ${width}px`;
                }
                if (isNumericString(height)) {
                    style += `; --height: ${height}px`;
                }
                node.setAttribute("style", style);
            }
        });
        dom.current.querySelectorAll("span.katex").forEach(node => {
            createRoot(node).render(
                <Suspense fallback={<>Loading math...</>}>
                    <InlineMath math={(node as HTMLElement).innerText}/>
                </Suspense>
            );
        });
        dom.current.querySelectorAll("div.katex").forEach(node => {
            createRoot(node).render(
                <Suspense fallback={<>Loading math...</>}>
                    <BlockMath math={(node as HTMLElement).innerText}/>
                </Suspense>
            );
        });
        dom.current.querySelectorAll("mr-spoiler").forEach(node => {
            const title = node.getAttribute("title") ?? undefined;
            const html = node.innerHTML;

            createRoot(node).render(
                <Provider store={store}>
                    <MrSpoiler title={title}><span dangerouslySetInnerHTML={{__html: html}}/></MrSpoiler>
                </Provider>
            );
        });
    }

    const onClickLink = (event: MouseEvent) => interceptLinkClick(event, initFromLocation, newLocation, goToLocation);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => hydrate(), [html]);

    useEffect(() => {
        const root = dom.current;

        if (root == null) {
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
        fontMagnitude: getPostingBodyFontMagnitude(state)
    }),
    { initFromLocation, goToLocation, newLocation }
);

export default connector(EntryHtml);

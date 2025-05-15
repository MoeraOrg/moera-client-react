import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import 'katex/dist/katex.min.css';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { BlockMath, InlineMath } from "ui/katex";
import NodeNameMention from "ui/nodename/NodeNameMention";
import Jump from "ui/navigation/Jump";
import EntryImage from "ui/entry/EntryImage";
import { interceptLinkClick } from "ui/entry/link-click-intercept";
import MrSpoiler from "ui/entry/MrSpoiler";
import { isNumericString, notNull } from "util/misc";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import { mediaHashStrip } from "util/media-images";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { wrapHashtags } from "ui/entry/wrap-hashtags";
import { ut } from "util/url";

interface Props {
    className?: string;
    postingId?: string | null;
    commentId?: string | null;
    html: string | null | undefined;
    nodeName?: RelNodeName | string;
    media?: MediaAttachment[] | null;
    onClick?: (event: React.MouseEvent) => void;
}

export default function EntryHtml({
    className, postingId, commentId, html, nodeName = REL_CURRENT, media, onClick
}: Props) {
    const openInNewWindow = useSelector((state: ClientState) => getSetting(state, "link.new-window") as boolean);

    const dom = useRef<HTMLDivElement>(null);
    const mediaMap: Map<string, PrivateMediaFileInfo> = new Map(
        (media ?? [])
            .map(ma => ma.media)
            .filter(notNull)
            .map(mf => [mediaHashStrip(mf.hash), mf])
    );

    const hydrate = () => {
        if (dom.current == null) {
            return;
        }

        wrapHashtags(dom.current);

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
                    <Provider store={window.store}>
                        <NodeNameMention name={name} fullName={fullName} text={text}/>
                    </Provider>
                );
            } else {
                const html = node.innerHTML;
                createRoot(span).render(
                    <Provider store={window.store}>
                        <Jump nodeName={name ?? undefined} href={href}>
                            <span dangerouslySetInnerHTML={{__html: html}}/>
                        </Jump>
                    </Provider>
                );
            }
        });
        dom.current.querySelectorAll("span[data-hashtag]").forEach(node => {
            const hashtag = node.getAttribute("data-hashtag");
            createRoot(node).render(
                <Provider store={window.store}>
                    <Jump href={ut`/search?query=${hashtag}`}>{hashtag}</Jump>
                </Provider>
            );
        });
        dom.current.querySelectorAll("img").forEach(node => {
            const src = node.getAttribute("src");
            const mediaFile = src != null && src.startsWith("hash:")
                ? mediaMap.get(mediaHashStrip(src.substring(5)))
                : null;
            if (mediaFile != null) {
                const width = node.getAttribute("width");
                const height = node.getAttribute("height");
                const alt = node.getAttribute("alt");
                const title = node.getAttribute("title");
                const style = node.getAttribute("style");

                const span = document.createElement("span");
                if (style != null) {
                    span.setAttribute("style", style);
                }
                span.className = "preload-placeholder";
                node.replaceWith(span);

                createRoot(span).render(
                    <Provider store={window.store}>
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
                <InlineMath math={(node as HTMLElement).innerText}/>
            );
        });
        dom.current.querySelectorAll("div.katex").forEach(node => {
            createRoot(node).render(
                <BlockMath math={(node as HTMLElement).innerText}/>
            );
        });
        dom.current.querySelectorAll("mr-spoiler").forEach(node => {
            const title = node.getAttribute("title") || undefined;
            const html = node.innerHTML;

            createRoot(node).render(
                <Provider store={window.store}>
                    <MrSpoiler title={title}><span dangerouslySetInnerHTML={{__html: html}}/></MrSpoiler>
                </Provider>
            );
        });
        dom.current.querySelectorAll("div.mr-spoiler").forEach(node => {
            const title = node.getAttribute("data-title") || undefined;
            const html = node.innerHTML;

            createRoot(node).render(
                <Provider store={window.store}>
                    <MrSpoiler title={title}><span dangerouslySetInnerHTML={{__html: html}}/></MrSpoiler>
                </Provider>
            );
        });
    }

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
                node.addEventListener("click", interceptLinkClick);
                if (openInNewWindow) {
                    node.setAttribute("target", "_blank");
                }
            }
        });

        return () => {
            root.querySelectorAll("a").forEach(node => {
                const name = node.getAttribute("data-nodename");
                if (!name) {
                    node.removeEventListener("click", interceptLinkClick);
                    node.removeAttribute("target");
                }
            });
        }
    }, [html, openInNewWindow]);

    return <div ref={dom} className={className} style={{fontSize: "var(--posting-font-magnitude)"}} onClick={onClick}
                dangerouslySetInnerHTML={{__html: html ?? ""}}/>
}

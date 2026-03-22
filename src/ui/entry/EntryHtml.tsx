import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { attributesToProps, DOMNode, domToReact, htmlToDOM } from 'html-react-parser';
import { isTag } from 'domhandler';
import 'katex/dist/katex.min.css';

import { MediaAttachment, PrivateMediaFileInfo } from "api";
import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { BlockMath, InlineMath } from "ui/katex";
import NodeNameMention from "ui/nodename/NodeNameMention";
import Jump from "ui/navigation/Jump";
import { interceptLinkClick } from "ui/entry/link-click-intercept";
import { wrapHashtags } from "ui/entry/wrap-hashtags";
import EntryImage from "ui/entry/EntryImage";
import EntryExpandAllDetailsButton from "ui/entry/EntryExpandAllDetailsButton";
import MrSpoiler from "ui/entry/MrSpoiler";
import { isNumericString, notNull } from "util/misc";
import { REL_CURRENT, RelNodeName } from "util/rel-node-name";
import { mediaHashStrip } from "util/media-images";
import { hasClass, textContent } from "util/domhandler";
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
    const contentRef = useRef<HTMLDivElement>(null);

    const mediaMap: Map<string, PrivateMediaFileInfo> = useMemo(() => new Map(
        (media ?? [])
            .map(ma => ma.media)
            .filter(notNull)
            .map(mf => [mediaHashStrip(mf.hash), mf])
    ), [media]);

    const options = useMemo(() => ({
        replace: (node: DOMNode) => {
            if (!isTag(node)) {
                return;
            }

            if (node.name === "a") {
                if ("data-nodename" in node.attribs) {
                    const name = node.attribs["data-nodename"];
                    const href = node.attribs["data-href"];

                    if (!href || href === "/") {
                        const text = textContent(node);
                        const fullName = text.startsWith("@") ? text.substring(1) : text;
                        return <NodeNameMention name={name} fullName={fullName} text={text}/>;
                    } else {
                        return (
                            <Jump nodeName={name} href={href}>
                                {domToReact(node.children as DOMNode[], options)}
                            </Jump>
                        );
                    }
                }

                const props = attributesToProps(node.attribs);
                if (openInNewWindow) {
                    props["target"] = "_blank";
                    let rel = node.attribs.rel;
                    if (!rel?.includes("noreferrer")) {
                        rel = rel ? rel + " noreferrer" : "noreferrer";
                    }
                    props["rel"] = rel;
                }
                return (
                    <a {...props} onClick={interceptLinkClick}>
                        {domToReact(node.children as DOMNode[], options)}
                    </a>
                );
            }

            if (node.name === "span" && "data-hashtag" in node.attribs) {
                const hashtag = node.attribs["data-hashtag"];

                return <Jump href={ut`/search?query=${hashtag}`}>{hashtag}</Jump>;
            }

            if (node.name === "img") {
                const src: string | undefined = node.attribs.src;
                const mediaFile = src?.startsWith("hash:")
                    ? mediaMap.get(mediaHashStrip(src.substring(5)))
                    : null;
                if (mediaFile != null) {
                    const width = node.attribs.width;
                    const height = node.attribs.height;
                    const alt = node.attribs.alt;
                    const title = node.attribs.title;
                    const style = node.attribs.style;

                    return (
                        <span className="preload-placeholder" {...attributesToProps({style})}>
                            <EntryImage postingId={postingId} commentId={commentId} nodeName={nodeName ?? null}
                                        mediaFile={mediaFile} width={width} height={height} alt={alt} title={title}/>
                        </span>
                    );
                } else if (src?.startsWith("hash:")) {
                    return <></>;
                } else {
                    const width = node.attribs.width;
                    const height = node.attribs.height;
                    let style = node.attribs.style ?? "";
                    if (isNumericString(width)) {
                        style += `; --width: ${width}px`;
                    }
                    if (isNumericString(height)) {
                        style += `; --height: ${height}px`;
                    }

                    const props = attributesToProps({...node.attribs, style});
                    // eslint-disable-next-line jsx-a11y/alt-text
                    return <img {...props}/>;
                }
            }

            if (node.name === "span" && hasClass(node, "katex")) {
                return <InlineMath math={textContent(node)}/>;
            }

            if (node.name === "div" && hasClass(node, "katex")) {
                return <BlockMath math={textContent(node)}/>;
            }

            if (node.name === "mr-spoiler") {
                const title = node.attribs.title || undefined;

                return <MrSpoiler title={title}>{domToReact(node.children as DOMNode[], options)}</MrSpoiler>;
            }

            if (node.name === "div" && hasClass(node, "mr-spoiler")) {
                const title = node.attribs["data-title"] || undefined;

                return <MrSpoiler title={title}>{domToReact(node.children as DOMNode[], options)}</MrSpoiler>;
            }
        }
    }), [commentId, mediaMap, nodeName, openInNewWindow, postingId]);

    const parsedHtml = useMemo(
        () => wrapHashtags(htmlToDOM(html ?? "", {lowerCaseAttributeNames: false})) as DOMNode[],
        [html]
    );
    const totalDetails = useMemo(() => countDetails(parsedHtml), [parsedHtml]);
    const content = useMemo(() => domToReact(parsedHtml, options), [parsedHtml, options]);

    return (
        <div className={className} style={{fontSize: "var(--posting-font-magnitude)"}}>
            {totalDetails >= 3 &&
                <EntryExpandAllDetailsButton contentRef={contentRef}/>
            }
            <div ref={contentRef} onClick={onClick}>
                {content}
            </div>
        </div>
    );
}

function countDetails(nodes: DOMNode[]): number {
    let count = 0;
    for (const node of nodes) {
        if (!isTag(node)) {
            continue;
        }
        if (node.name === "details") {
            count++;
        }
        count += countDetails(node.children as DOMNode[]);
    }
    return count;
}

import React, { useMemo } from 'react';
import htmlToReact, { DOMNode } from 'html-react-parser';
import { isTag } from 'domhandler';

import { ExtStoryInfo } from "state/feeds/state";
import InstantMention from "ui/instant/InstantMention";
import InstantIcon from "ui/instant/InstantIcon";
import { useNameDisplayMode } from "ui/nodename/hooks";
import { textContent } from "util/domhandler";

interface Props {
    story: ExtStoryInfo;
}

export default function InstantHtml({story}: Props) {
    const mode = useNameDisplayMode();

    const options = useMemo(() => ({
        replace: (node: DOMNode) => {
            if (isTag(node) && node.name === "span" && "data-nodename" in node.attribs) {
                const name = node.attribs["data-nodename"];
                const sourceUri = node.attribs["data-source-uri"]
                    ?? (name === story.summaryNodeName ? story.summarySourceUri : undefined)
                    ?? (name === story.remoteNodeName ? story.remoteSourceUri : undefined);
                const fullName = textContent(node);

                return <InstantMention name={name} fullName={fullName} sourceUri={sourceUri} mode={mode}/>
            }
        }
    }), [mode, story.remoteNodeName, story.remoteSourceUri, story.summaryNodeName, story.summarySourceUri]);

    const content = useMemo(() => htmlToReact(story.summary ?? "", options), [story.summary, options]);

    return (
        <>
            <InstantIcon story={story}/>
            <span>{content}</span>
        </>
    );
}

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
                const fullName = textContent(node);

                return <InstantMention name={name} fullName={fullName} mode={mode}/>
            }
        }
    }), [mode]);

    const content = useMemo(() => htmlToReact(story.summary ?? "", options), [story.summary, options]);

    return (
        <>
            <InstantIcon story={story}/>
            <span>{content}</span>
        </>
    );
}

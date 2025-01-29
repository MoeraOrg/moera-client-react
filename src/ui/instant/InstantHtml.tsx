import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';

import { ClientState } from "state/state";
import { getSetting } from "state/settings/selectors";
import { ExtStoryInfo } from "state/feeds/state";
import InstantMention from "ui/instant/InstantMention";
import { NameDisplayMode } from "ui/types";
import InstantIcon from "ui/instant/InstantIcon";

interface Props {
    story: ExtStoryInfo;
}

export default function InstantHtml({story}: Props) {
    const mode = useSelector((state: ClientState) => getSetting(state, "full-name.display") as NameDisplayMode);

    const dom = useRef<HTMLDivElement>(null);
    const html = story.summary ?? "";

    useEffect(() => {
        if (dom.current == null) {
            return;
        }
        dom.current.querySelectorAll("span[data-nodename]").forEach(node => {
            const name = node.getAttribute("data-nodename");

            const span = document.createElement("span");
            node.replaceWith(span);
            span.appendChild(node);

            const fullName = (node as HTMLSpanElement).innerText;
            createRoot(span).render(
                <Provider store={window.store}>
                    <InstantMention name={name} fullName={fullName} mode={mode}/>
                </Provider>
            );
        });
    }, [dom, html, mode]);

    return (
        <>
            <InstantIcon story={story}/>
            <span ref={dom} dangerouslySetInnerHTML={{__html: html}}/>
        </>
    );
}

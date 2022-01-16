import React, { useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { connect, ConnectedProps, Provider } from 'react-redux';

import { ClientState } from "state/state";
import store from "state/store";
import { getSetting } from "state/settings/selectors";
import { ExtStoryInfo } from "state/feeds/state";
import InstantMention from "ui/instant/InstantMention";
import { NameDisplayMode } from "ui/types";
import InstantIcon from "ui/instant/InstantIcon";

type Props = {
    story: ExtStoryInfo;
} & ConnectedProps<typeof connector>;

function InstantHtml({story, mode}: Props) {
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
            ReactDOM.render(
                <Provider store={store}>
                    <InstantMention name={name} fullName={fullName} mode={mode}/>
                </Provider>, span);
        });
    }, [dom, html, mode]);

    return (
        <>
            <InstantIcon story={story}/>
            <span ref={dom} dangerouslySetInnerHTML={{__html: html}}/>
        </>
    );
}

const connector = connect(
    (state: ClientState) => ({
        mode: getSetting(state, "full-name.display") as NameDisplayMode
    })
);

export default connector(InstantHtml);

import React, { useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { connect, ConnectedProps, Provider } from 'react-redux';

import { ClientState } from "state/state";
import store from "state/store";
import { getSetting } from "state/settings/selectors";
import InstantMention from "ui/instant/InstantMention";
import { NameDisplayMode } from "ui/types";

type Props = {
    html: string;
} & ConnectedProps<typeof connector>;

function InstantHtml({html, mode}: Props) {
    const dom = useRef<HTMLDivElement>(null);

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

    return <div ref={dom} dangerouslySetInnerHTML={{__html: html}}/>
}

const connector = connect(
    (state: ClientState) => ({
        mode: getSetting(state, "full-name.display") as NameDisplayMode
    })
);

export default connector(InstantHtml);

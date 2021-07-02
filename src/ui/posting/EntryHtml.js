import React, { Suspense, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import PropType from 'prop-types';
import * as URI from 'uri-js';
import 'katex/dist/katex.min.css';

import store from "state/store";
import { getSetting } from "state/settings/selectors";
import NodeNameMention from "ui/nodename/NodeNameMention";
import Jump from "ui/navigation/Jump";
import { isStandaloneMode } from "state/navigation/selectors";
import { goToLocation, initFromLocation } from "state/navigation/actions";
import { Browser } from "ui/browser";
import { rootUrl } from "util/url";

const InlineMath = React.lazy(() => import("ui/katex/InlineMath"));
const BlockMath = React.lazy(() => import("ui/katex/BlockMath"));

function EntryHtml({className, html, onClick, standalone, fontMagnitude, initFromLocation, goToLocation}) {
    const dom = useRef();

    const hydrate = () => {
        dom.current.querySelectorAll("a[data-nodename]").forEach(node => {
            const name = node.getAttribute("data-nodename");
            const href = node.getAttribute("data-href");

            const span = document.createElement("span");
            node.replaceWith(span);

            if (!href || href === "/") {
                span.appendChild(node);

                const text = node.innerText;
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
        dom.current.querySelectorAll("span.katex").forEach(node => {
            ReactDOM.render(
                <Suspense fallback={<>Loading math...</>}>
                    <InlineMath math={node.innerText}/>
                </Suspense>, node);
        });
        dom.current.querySelectorAll("div.katex").forEach(node => {
            ReactDOM.render(
                <Suspense fallback={<>Loading math...</>}>
                    <BlockMath math={node.innerText}/>
                </Suspense>, node);
        });
    }

    const onClickLink = event => {
        const href = event.target.getAttribute("href");
        if (!href) {
            return;
        }
        const parts = URI.parse(URI.normalize(href));
        if (parts.scheme !== "https") {
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
                const rootPage = rootUrl(parts.scheme, parts.host, parts.port);
                const {rootLocation, path, query, hash} =
                    Browser.getLocation(rootPage, parts.path, parts.query, parts.fragment, headers.get("X-Moera"));
                if (rootLocation !== Browser.getRootLocation()) {
                    initFromLocation(rootLocation, path, query, hash);
                } else {
                    goToLocation(path, query, hash);
                }
            } else {
                window.location = href;
            }
        }).catch(() => {
            window.location = href;
        });
        event.preventDefault();
    }

    useEffect(() => hydrate());

    useEffect(() => {
        if (!standalone) {
            return;
        }

        const root = dom.current;
        const handleClick = onClickLink;
        root.querySelectorAll("a").forEach(node => {
            const name = node.getAttribute("data-nodename");
            if (!name) {
                node.addEventListener("click", handleClick);
            }
        });

        return () => {
            root.querySelectorAll("a").forEach(node => {
                const name = node.getAttribute("data-nodename");
                if (!name) {
                    node.removeEventListener("click", handleClick);
                }
            });
        }
    });

    return <div ref={dom} className={className} style={{fontSize: `${fontMagnitude}%`}} onClick={onClick}
                dangerouslySetInnerHTML={{__html: html}}/>
}

EntryHtml.propTypes = {
    className: PropType.string,
    html: PropType.string,
    onClick: PropType.func
};

export default connect(
    state => ({
        standalone: isStandaloneMode(state),
        fontMagnitude: getSetting(state, "posting.body.font-magnitude")
    }),
    { initFromLocation, goToLocation }
)(EntryHtml);

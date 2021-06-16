import React, { Suspense, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import PropType from 'prop-types';
import 'katex/dist/katex.min.css';

import store from "state/store";
import { getSetting } from "state/settings/selectors";
import NodeNameMention from "ui/nodename/NodeNameMention";
import Jump from "ui/navigation/Jump";

const InlineMath = React.lazy(() => import("ui/katex/InlineMath"));
const BlockMath = React.lazy(() => import("ui/katex/BlockMath"));

function EntryHtml({className, html, onClick, fontMagnitude}) {
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

    useEffect(() => {
        hydrate();
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
        fontMagnitude: getSetting(state, "posting.body.font-magnitude")
    })
)(EntryHtml);

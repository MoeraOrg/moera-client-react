import React, { Suspense } from 'react';
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

class EntryHtml extends React.PureComponent {

    static propTypes = {
        className: PropType.string,
        html: PropType.string
    };

    #dom;

    componentDidMount() {
        this.hydrate();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.hydrate();
    }

    hydrate() {
        this.#dom.querySelectorAll("a[data-nodename]").forEach(node => {
            const name = node.getAttribute("data-nodename");
            const href = node.getAttribute("data-href");

            const span = document.createElement("span");
            node.replaceWith(span);

            if (!href || href === "/") {
                span.appendChild(node);

                const text = node.innerText;
                const fullName = text.startsWith("@") ? text.substring(1) : text;
                ReactDOM.hydrate(
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
        this.#dom.querySelectorAll("span.katex").forEach(node => {
            ReactDOM.render(
                <Suspense fallback={<>Loading math...</>}>
                    <InlineMath math={node.innerText}/>
                </Suspense>, node);
        });
        this.#dom.querySelectorAll("div.katex").forEach(node => {
            ReactDOM.render(
                <Suspense fallback={<>Loading math...</>}>
                    <BlockMath math={node.innerText}/>
                </Suspense>, node);
        });
    }

    render() {
        const {className, html, fontMagnitude} = this.props;

        return <div ref={dom => this.#dom = dom} className={className} style={{fontSize: `${fontMagnitude}%`}}
                    dangerouslySetInnerHTML={{__html: html}}/>
    }

}

export default connect(
    state => ({
        fontMagnitude: getSetting(state, "posting.body.font-magnitude")
    })
)(EntryHtml);

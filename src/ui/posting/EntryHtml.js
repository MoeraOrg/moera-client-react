import React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import PropType from 'prop-types';

import store from "state/store";
import { getSetting } from "state/settings/selectors";
import NodeNameMention from "ui/nodename/NodeNameMention";

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
            const text = node.innerText;

            const span = document.createElement("span");
            node.replaceWith(span);
            span.appendChild(node);

            ReactDOM.hydrate(
                <Provider store={store}>
                    <NodeNameMention name={name} text={text}/>
                </Provider>, span);
        });
    }

    render() {
        const {className, html, fontMagnitude} = this.props;

        return <div ref={dom => this.#dom = dom} className={className} style={{fontSize: `${fontMagnitude}%`}}
                    dangerouslySetInnerHTML={{__html: html}} />
    }

}

export default connect(
    state => ({
        fontMagnitude: getSetting(state, "posting.body.font-magnitude")
    })
)(EntryHtml);

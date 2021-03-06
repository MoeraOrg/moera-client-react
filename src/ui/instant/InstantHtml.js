import React from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import PropType from 'prop-types';

import store from "state/store";
import { getSetting } from "state/settings/selectors";
import InstantMention from "ui/instant/InstantMention";

class InstantHtml extends React.PureComponent {

    static propTypes = {
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
        const {mode} = this.props;

        this.#dom.querySelectorAll("span[data-nodename]").forEach(node => {
            const name = node.getAttribute("data-nodename");

            const span = document.createElement("span");
            node.replaceWith(span);
            span.appendChild(node);

            const fullName = node.innerText;
            ReactDOM.render(
                <Provider store={store}>
                    <InstantMention name={name} fullName={fullName} mode={mode}/>
                </Provider>, span);
        });
    }

    render() {
        const {html} = this.props;

        return <div ref={dom => this.#dom = dom} dangerouslySetInnerHTML={{__html: html}}/>
    }

}

export default connect(
    state => ({
        mode: getSetting(state, "full-name.display")
    })
)(InstantHtml);

import React, { useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import PropType from 'prop-types';

import store from "state/store";
import { getSetting } from "state/settings/selectors";
import InstantMention from "ui/instant/InstantMention";

function InstantHtml({html, mode}) {
    const dom = useRef();

    useEffect(() => {
        dom.current.querySelectorAll("span[data-nodename]").forEach(node => {
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
    }, [dom, html, mode]);

    return <div ref={dom} dangerouslySetInnerHTML={{__html: html}}/>
}

InstantHtml.propTypes = {
    html: PropType.string
};

export default connect(
    state => ({
        mode: getSetting(state, "full-name.display")
    })
)(InstantHtml);

import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';

import { Browser } from "api";
import { getNamingNameDetails } from "state/naming/selectors";
import { urlWithParameters } from "util/misc";
import { getSetting } from "state/settings/selectors";
import { isConnectedToHome } from "state/home/selectors";
import { isStandaloneMode } from "state/navigation/selectors";

class EntryHtml extends React.PureComponent {

    static propTypes = {
        className: PropType.string,
        html: PropType.string
    };

    #dom;

    render() {
        const {className, html, fontMagnitude} = this.props;

        return <div ref={dom => this.#dom = dom} className={className} style={{fontSize: `${fontMagnitude}%`}}
                    dangerouslySetInnerHTML={{__html: html}} />
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {standalone, homePageRoot, getNameDetails} = this.props;

        this.#dom.querySelectorAll("a[data-nodename]").forEach(node => {
            const name = node.getAttribute("data-nodename");
            const details = getNameDetails(name);
            let href;
            if (details.loaded) {
                href = !standalone ? details.nodeUri : Browser.passedLocation(details.nodeUri);
            } else {
                const client = standalone ? Browser.getRootLocation() : null;
                href = urlWithParameters(homePageRoot + "/gotoname", {client, name});
            }
            node.setAttribute("href", href);
        });
    }

}

export default connect(
    state => ({
        standalone: isStandaloneMode(state),
        homePageRoot: isConnectedToHome(state) ? state.home.root.page : state.node.root.page,
        getNameDetails: name => getNamingNameDetails(state, name),
        fontMagnitude: getSetting(state, "posting.body.font-magnitude")
    })
)(EntryHtml);

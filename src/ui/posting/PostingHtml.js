import React from 'react';
import { connect } from 'react-redux';
import PropType from 'prop-types';
import { getNamingNameDetails } from "state/naming/selectors";
import { urlWithParameters } from "util/misc";

class PostingHtml extends React.PureComponent {

    static propTypes = {
        className: PropType.string,
        html: PropType.string
    };

    #dom;

    render() {
        const {className, html} = this.props;

        return <div ref={dom => this.#dom = dom} className={className} dangerouslySetInnerHTML={{__html: html}} />
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {homePageRoot, getNameDetails} = this.props;

        this.#dom.querySelectorAll("a[data-nodename]").forEach(node => {
            const name = node.getAttribute("data-nodename");
            const details = getNameDetails(name);
            const href = details.loaded
                ? details.nodeUri : urlWithParameters(homePageRoot + "/gotoname", {name});
            node.setAttribute("href", href);
        });
    }

}

export default connect(
    state => ({
        homePageRoot: state.home.root.page,
        getNameDetails: name => getNamingNameDetails(state, name)
    })
)(PostingHtml);

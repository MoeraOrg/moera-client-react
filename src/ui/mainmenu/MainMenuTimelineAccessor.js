import React from 'react';
import { connect } from 'react-redux';

import { Browser } from "api";
import { goToTimeline } from "state/navigation/actions";
import { isAtTimelinePage, isStandaloneMode } from "state/navigation/selectors";
import { getFeedState } from "state/feeds/selectors";

class MainMenuTimelineAccessor extends React.PureComponent {

    render() {
        const {standalone, rootLocation, active, anchor, goToTimeline} = this.props;

        let href = anchor != null ? `${rootLocation}/timeline?before=${anchor}` : rootLocation + "/timeline";
        href = !standalone ? href : Browser.passedLocation(href);
        const onClick = event => {
            goToTimeline(active ? Number.MAX_SAFE_INTEGER : anchor);
            event.preventDefault();
        };
        return (
            <>
                {this.props.children(active, href, onClick)}
            </>
        );
    };

}

export default connect(
    state => ({
        standalone: isStandaloneMode(state),
        rootLocation: state.node.root.location,
        active: isAtTimelinePage(state),
        anchor: getFeedState(state, "timeline").anchor
    }),
    { goToTimeline }
)(MainMenuTimelineAccessor);

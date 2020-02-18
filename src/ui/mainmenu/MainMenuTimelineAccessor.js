import React from 'react';
import { connect } from 'react-redux';

import { goToTimeline } from "state/navigation/actions";
import { isAtComposePage, isAtDetailedPostingPage, isAtTimelinePage } from "state/navigation/selectors";

class MainMenuTimelineAccessor extends React.PureComponent {

    render() {
        const {rootLocation, active, anchor, goToTimeline} = this.props;

        const href = anchor != null ? `${rootLocation}/timeline?before=${anchor}` : rootLocation + "/timeline";
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
        rootLocation: state.node.root.location,
        active: isAtTimelinePage(state) || isAtDetailedPostingPage(state) || isAtComposePage(state),
        anchor: state.timeline.anchor
    }),
    { goToTimeline }
)(MainMenuTimelineAccessor);

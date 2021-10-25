import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Popover } from "ui/control";
import InstantBell from "ui/instant/InstantBell";
import Instants from "ui/instant/Instants";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedNotViewed, getFeedState, getInstantCount } from "state/feeds/selectors";
import { ClientState } from "state/state";

type Props = ConnectedProps<typeof connector>;

interface State {
    instantCount: number;
}

class InstantButton extends React.PureComponent<Props, State> {

    #visible: boolean = false;
    #topMoment: number = Number.MIN_SAFE_INTEGER;

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            instantCount: 0
        };
    }

    componentDidUpdate() {
        this.viewAll();
    }

    onToggle = (visible: boolean) => {
        if (visible && this.#visible !== visible) {
            this.setState({instantCount: this.props.instantCount});
        }
        this.#visible = visible;
        this.viewAll();
    }

    viewAll() {
        const {stories, notViewedCount, feedStatusUpdate} = this.props;

        if (document.visibilityState !== "visible" || !this.#visible || stories == null || stories.length === 0
            || notViewedCount === 0 || this.#topMoment === stories[0].moment) {

            return;
        }
        this.#topMoment = stories[0].moment;
        feedStatusUpdate(":instant", true, null, this.#topMoment);
    }

    render() {
        return (
            <Popover element={InstantBell} className="instant-popover" detached onToggle={this.onToggle}>
                {({hide}) => (
                    <Instants hide={hide} instantCount={this.state.instantCount}/>
                )}
            </Popover>
        );
    }

}

const connector = connect(
    (state: ClientState) => ({
        stories: getFeedState(state, ":instant").stories,
        notViewedCount: getFeedNotViewed(state, ":instant"),
        instantCount: getInstantCount(state)
    }),
    { feedStatusUpdate }
);

export default connector(InstantButton);

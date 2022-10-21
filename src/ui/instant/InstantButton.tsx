import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ClientState } from "state/state";
import { feedStatusUpdate } from "state/feeds/actions";
import { getFeedNotViewed, getFeedState, getInstantBorder } from "state/feeds/selectors";
import { Popover } from "ui/control";
import InstantBell from "ui/instant/InstantBell";
import Instants from "ui/instant/Instants";

type Props = ConnectedProps<typeof connector>;

interface State {
    instantBorder: number;
}

class InstantButton extends React.PureComponent<Props, State> {

    #visible: boolean = false;
    #topMoment: number = Number.MIN_SAFE_INTEGER;

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            instantBorder: Number.MAX_SAFE_INTEGER
        };
    }

    componentDidUpdate() {
        this.viewAll();
    }

    onToggle = (visible: boolean) => {
        if (visible && this.#visible !== visible) {
            this.setState({instantBorder: this.props.instantBorder});
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
            <Popover element={InstantBell} className="instant-popover" detached offset={[0, 10]}
                     onToggle={this.onToggle}>
                {({hide}) =>
                    <Instants hide={hide} instantBorder={this.state.instantBorder}/>
                }
            </Popover>
        );
    }

}

const connector = connect(
    (state: ClientState) => ({
        stories: getFeedState(state, ":instant").stories,
        notViewedCount: getFeedNotViewed(state, ":instant"),
        instantBorder: getInstantBorder(state)
    }),
    { feedStatusUpdate }
);

export default connector(InstantButton);

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { endOfDay, fromUnixTime, getUnixTime } from 'date-fns';

import { Button } from "ui/control";
import { getFeedAtTimestamp } from "state/feeds/selectors";
import { feedScrollToAnchor } from "state/feeds/actions";
import "./FeedGotoButton.css";
import { ClientState } from "state/state";
import { Browser } from "ui/browser";

interface OwnProps {
    feedName: string;
    atBottom: boolean;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

interface State {
    active: boolean;
}

class FeedGotoButton extends React.PureComponent<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {active: false};
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (this.props.timestamp !== prevProps.timestamp) {
            this.setState({active: false});
        }
    }

    activate = () => {
        this.setState({active: true});
    };

    goToTimestamp = (date: Date) => {
        const moment = getUnixTime(endOfDay(date)) * 1000;
        if (isNaN(moment)) {
            return;
        }
        this.props.feedScrollToAnchor(this.props.feedName, moment);
    };

    toBottom = (e: React.MouseEvent) => {
        this.props.feedScrollToAnchor(this.props.feedName, Number.MIN_SAFE_INTEGER);
        e.preventDefault();
    };

    render() {
        const {timestamp, atBottom} = this.props;
        const {active} = this.state;

        return (
            <div className="feed-buttons">
                {!active ?
                    <Button variant="outline-info" size="sm" onClick={this.activate}>Go to...</Button>
                :
                    <>
                        <DatePicker selected={fromUnixTime(timestamp >= 0 ? timestamp : 0)}
                                    onChange={v => {
                                        if (v instanceof Date) {
                                            this.goToTimestamp(v);
                                        }
                                    }}
                                    dateFormat="dd-MM-yyyy"
                                    withPortal={Browser.isTinyScreen()}/>
                        <Button variant="outline-info" size="sm" className="ml-2" invisible={atBottom}
                                onClick={this.toBottom}>
                            <FontAwesomeIcon icon="arrow-down"/>&nbsp;Bottom
                        </Button>
                    </>
                }
            </div>
        );
    }

}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        timestamp: getFeedAtTimestamp(state, ownProps.feedName)
    }),
    { feedScrollToAnchor }
);

export default connector(FeedGotoButton);

import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { DatePicker } from 'react-widgets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { endOfDay, fromUnixTime, getUnixTime } from 'date-fns';

import { Button } from "ui/control";
import { getFeedAtTimestamp } from "state/feeds/selectors";
import { feedScrollToAnchor } from "state/feeds/actions";
import "./FeedGotoButton.css";

class FeedGotoButton extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.state = {active: false};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.timestamp !== prevProps.timestamp) {
            this.setState({active: false});
        }
    }

    activate = () => {
        this.setState({active: true});
    };

    goToTimestamp = date => {
        const moment = getUnixTime(endOfDay(date)) * 1000;
        if (isNaN(moment)) {
            return;
        }
        this.props.feedScrollToAnchor(this.props.feedName, moment);
    };

    toBottom = e => {
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
                        <DatePicker valueFormat={{dateStyle: "short"}} value={fromUnixTime(timestamp)} time={false}
                                    onChange={this.goToTimestamp}/>
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

FeedGotoButton.propTypes = {
    feedName: PropType.string,
    atBottom: PropType.bool
}

export default connect(
    (state, ownProps) => ({
        timestamp: getFeedAtTimestamp(state, ownProps.feedName)
    }),
    { feedScrollToAnchor }
)(FeedGotoButton);

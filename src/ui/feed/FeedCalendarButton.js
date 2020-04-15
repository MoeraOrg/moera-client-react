import React from 'react';
import { connect } from 'react-redux';
import { DateTimePicker } from 'react-widgets';
import moment from 'moment';

import { Button } from "ui/control";
import { getFeedAtTimestamp } from "state/feeds/selectors";
import { feedScrollToAnchor } from "state/feeds/actions";

class FeedCalendarButton extends React.PureComponent {

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

    goToTimestamp = value => {
        this.props.feedScrollToAnchor(this.props.feedName, moment(value).endOf('day').unix() * 100);
    };

    render() {
        const {timestamp} = this.props;
        const {active} = this.state;

        return (
            <div className="timeline-btn">
                {!active &&
                    <Button variant="outline-info" size="sm" onClick={this.activate}>Calendar</Button>
                }
                {active &&
                    <DateTimePicker format="dd-MM-yyyy" value={moment.unix(timestamp).toDate()} time={false}
                                    onChange={this.goToTimestamp}/>
                }
            </div>
        );
    }

}

export default connect(
    (state, ownProps) => ({
        timestamp: getFeedAtTimestamp(state, ownProps.feedName)
    }),
    { feedScrollToAnchor }
)(FeedCalendarButton);

import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { endOfDay, fromUnixTime, getUnixTime } from 'date-fns';

import { ClientState } from "state/state";
import { getFeedAtTimestamp } from "state/feeds/selectors";
import { feedScrollToAnchor } from "state/feeds/actions";
import { Browser } from "ui/browser";
import { Button } from "ui/control";
import "./FeedGotoButton.css";

interface OwnProps {
    feedName: string;
    atBottom: boolean;
}

type Props = OwnProps & ConnectedProps<typeof connector>;

function FeedGotoButton({feedName, atBottom, timestamp, feedScrollToAnchor}: Props) {
    const [active, setActive] = useState<boolean>(false);

    useEffect(() => setActive(false), [timestamp]);

    const activate = () => setActive(true);

    const goToTimestamp = (date: Date) => {
        const moment = getUnixTime(endOfDay(date)) * 1000;
        if (isNaN(moment)) {
            return;
        }
        feedScrollToAnchor(feedName, moment);
    };

    const toBottom = (e: React.MouseEvent) => {
        feedScrollToAnchor(feedName, Number.MIN_SAFE_INTEGER);
        e.preventDefault();
    };

    return (
        <div className="feed-buttons">
            {!active ?
                <Button variant="outline-info" size="sm" onClick={activate}>Go to...</Button>
            :
                <>
                    <DatePicker selected={fromUnixTime(timestamp >= 0 ? timestamp : 0)}
                                onChange={v => {
                                    if (v instanceof Date) {
                                        goToTimestamp(v);
                                    }
                                }}
                                dateFormat="dd-MM-yyyy"
                                withPortal={Browser.isTinyScreen()}/>
                    <Button variant="outline-info" size="sm" className="ms-2" invisible={atBottom} onClick={toBottom}>
                        <FontAwesomeIcon icon="arrow-down"/>&nbsp;Bottom
                    </Button>
                </>
            }
        </div>
    );
}

const connector = connect(
    (state: ClientState, ownProps: OwnProps) => ({
        timestamp: getFeedAtTimestamp(state, ownProps.feedName)
    }),
    { feedScrollToAnchor }
);

export default connector(FeedGotoButton);

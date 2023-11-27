import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { endOfDay, fromUnixTime, getUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getFeedAtTimestamp } from "state/feeds/selectors";
import { feedScrollToAnchor } from "state/feeds/actions";
import { Browser } from "ui/browser";
import { Button, CloseButton } from "ui/control";

interface Props {
    feedName: string;
    atBottom: boolean;
}

export default function FeedGotoButton({feedName, atBottom}: Props) {
    const timestamp = useSelector((state: ClientState) => getFeedAtTimestamp(state, feedName));
    const dispatch = useDispatch();

    const [active, setActive] = useState<boolean>(false);
    const {t} = useTranslation();

    const activate = () => setActive(true);

    const deactivate = () => setActive(false);

    const goToTimestamp = (date: Date) => {
        const moment = getUnixTime(endOfDay(date)) * 1000;
        if (isNaN(moment)) {
            return;
        }
        dispatch(feedScrollToAnchor(feedName, moment));
    };

    const toBottom = (e: React.MouseEvent) => {
        dispatch(feedScrollToAnchor(feedName, Number.MIN_SAFE_INTEGER));
        e.preventDefault();
    };

    return (
        <>
            {!active ?
                <Button variant="outline-info" size="sm" onClick={activate}>{t("go-to")}</Button>
            :
                <>
                    <CloseButton onClick={deactivate}/>
                    <DatePicker selected={fromUnixTime(timestamp >= 0 ? timestamp : 0)}
                                onChange={v => {
                                    if (v instanceof Date) {
                                        goToTimestamp(v);
                                    }
                                }}
                                dateFormat="dd-MM-yyyy"
                                withPortal={Browser.isTinyScreen()}/>
                    <Button variant="outline-info" size="sm" className="ms-2" invisible={atBottom} onClick={toBottom}>
                        <FontAwesomeIcon icon="arrow-down"/>&nbsp;{t("bottom")}
                    </Button>
                </>
            }
        </>
    );
}

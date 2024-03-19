import React, { Suspense, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { endOfDay, fromUnixTime, getUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getFeedAtTimestamp } from "state/feeds/selectors";
import { feedScrollToAnchor } from "state/feeds/actions";
import * as Browser from "ui/browser";
import { Button, CloseButton, Loading } from "ui/control";
import { RelNodeName } from "util/rel-node-name";

const DatePicker = React.lazy(() => import('react-datepicker'));

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;
    atBottom: boolean;
}

export default function FeedGotoButton({nodeName, feedName, atBottom}: Props) {
    const timestamp = useSelector((state: ClientState) => getFeedAtTimestamp(state, nodeName, feedName));
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
        dispatch(feedScrollToAnchor(nodeName, feedName, moment));
    };

    const toBottom = (e: React.MouseEvent) => {
        dispatch(feedScrollToAnchor(nodeName, feedName, Number.MIN_SAFE_INTEGER));
        e.preventDefault();
    };

    return (
        <>
            {!active ?
                <Button variant="outline-info" size="sm" onClick={activate}>{t("go-to")}</Button>
            :
                <Suspense fallback={<Loading/>}>
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
                        <FontAwesomeIcon icon={faArrowDown}/>&nbsp;{t("bottom")}
                    </Button>
                </Suspense>
            }
        </>
    );
}

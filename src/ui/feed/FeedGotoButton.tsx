import React, { Suspense, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { endOfDay, fromUnixTime, getUnixTime } from 'date-fns';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

import { ClientState } from "state/state";
import { getFeedAtTimestamp } from "state/feeds/selectors";
import { feedScrollToAnchor } from "state/feeds/actions";
import { Button, CloseButton, Loading } from "ui/control";
import { Icon, msArrowDownward, msCalendarMonth } from "ui/material-symbols";
import { useIsTinyScreen } from "ui/hook";
import { RelNodeName } from "util/rel-node-name";
import "./FeedGotoButton.css";

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
    const tinyScreen = useIsTinyScreen();
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
        <span className={cx("feed-goto-button", {"active": active})}>
            {!active ?
                <Button variant="silent" size="sm" className="goto" onClick={activate}>
                    <Icon icon={msCalendarMonth}/>&nbsp;{t("go-to")}
                </Button>
            :
                <Suspense fallback={<Loading/>}>
                    <CloseButton onClick={deactivate}/>
                    <DatePicker
                        selected={fromUnixTime(timestamp >= 0 ? timestamp : 0)}
                        onChange={v => {
                            if (v instanceof Date) {
                                goToTimestamp(v);
                            }
                        }}
                        dateFormat="dd-MM-yyyy"
                        showYearDropdown
                        withPortal={tinyScreen}
                    />
                    <Button variant="outline-primary" size="sm" className="bottom" invisible={atBottom}
                            onClick={toBottom}>
                        <Icon icon={msArrowDownward} size={16}/>
                        <span className="caption only-desktop">&nbsp;{t("bottom")}</span>
                    </Button>
                </Suspense>
            }
        </span>
    );
}

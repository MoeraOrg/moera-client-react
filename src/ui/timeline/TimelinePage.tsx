import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { isAtTimelinePage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";
import { getFeedTitle } from "ui/feed/feeds";
import { REL_CURRENT } from "util/rel-node-name";

export default function TimelinePage() {
    const visible = useSelector(isAtTimelinePage);
    const {t} = useTranslation();

    return <FeedPage nodeName={REL_CURRENT} feedName="timeline" title={getFeedTitle("timeline", t)} shareable
                     visible={visible}/>;
};

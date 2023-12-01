import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { isAtNewsPage } from "state/navigation/selectors";
import FeedPage from "ui/feed/FeedPage";
import { getFeedTitle } from "ui/feed/feeds";

export default function NewsPage() {
    const visible = useSelector(isAtNewsPage);
    const {t} = useTranslation();

    return <FeedPage feedName="news" title={getFeedTitle("news", t)} visible={visible}/>;
}

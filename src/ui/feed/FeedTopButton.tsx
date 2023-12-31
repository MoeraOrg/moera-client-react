import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

import { feedScrollToAnchor } from "state/feeds/actions";
import "./FeedTopButton.css";

interface Props {
    feedName: string;
    atTop: boolean;
    totalAfterTop: number;
    notViewed: number;
    notViewedMoment: number | null;
}

export default function FeedTopButton({feedName, atTop, totalAfterTop, notViewed, notViewedMoment}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    if (atTop) {
        return null;
    }

    let title = " " + t("top");
    let news = 0;
    if (totalAfterTop > 0) {
        if (notViewed > 0) {
            if (totalAfterTop > notViewed) {
                title = " " + t("count-more", {count: totalAfterTop});
                news = notViewed;
            } else {
                title = "";
                news = totalAfterTop;
            }
        } else {
            title = " " + t("count-more", {count: totalAfterTop});
        }
    }

    const onClick = (event: React.MouseEvent) => {
        const moment = notViewedMoment != null && notViewed < totalAfterTop
            ? notViewedMoment
            : Number.MAX_SAFE_INTEGER;
        dispatch(feedScrollToAnchor(feedName, moment));
        event.preventDefault();
    };

    return (
        <div className="feed-top-box">
            <div className="feed-top-button" onClick={onClick}>
                <FontAwesomeIcon icon={faArrowUp}/>{title}
                {news > 0 && <span className="new">{t("count-new", {count: news})}</span>}
            </div>
        </div>
    );
};

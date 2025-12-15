import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { feedScrollToAnchor } from "state/feeds/actions";
import { Icon, msArrowUpward } from "ui/material-symbols";
import { RelNodeName } from "util/rel-node-name";

interface Props {
    nodeName: RelNodeName | string;
    feedName: string;
    atTop: boolean;
    totalAfterTop: number;
    notViewed: number;
    notViewedMoment: number | null;
    momentAbove: number | null;
}

export default function FeedTopButton({
    nodeName, feedName, atTop, totalAfterTop, notViewed, notViewedMoment, momentAbove
}: Props) {
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
        const moment =
            notViewedMoment != null
            && notViewed < totalAfterTop
            && (momentAbove == null || momentAbove !== notViewedMoment)
                ? notViewedMoment
                : Number.MAX_SAFE_INTEGER;
        dispatch(feedScrollToAnchor(nodeName, feedName, moment));
        event.preventDefault();
    };

    return (
        <div className="feed-top-button" onClick={onClick}>
            <Icon icon={msArrowUpward} size={16}/><span className="title">{title}</span>
            {news > 0 && <span className="new">{t("count-new-on-posts", {count: news})}</span>}
        </div>
    );
};

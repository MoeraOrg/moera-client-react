import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import Jump from "ui/navigation/Jump";
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { isAtNewsPage } from "state/navigation/selectors";
import { getFeedNotViewed, getFeedNotViewedMoment, isFeedAtBeginning } from "state/feeds/selectors";
import { getSetting } from "state/settings/selectors";
import "./NewsButton.css";

type Props = ConnectedProps<typeof connector>;

const NewsButton = ({atHome, atHomeNews, count, moment, atBeginning, targetStory}: Props) => {
    const {t} = useTranslation();

    let href = "/news";
    if (targetStory === "earliest-new") {
        if (atHome) {
            if ((atBeginning || atHomeNews) && moment != null) {
                href += `?before=${moment}`;
            }
        } else if (moment) {
            href += `?before=${moment}`;
        }
    }

    return (
        <Jump nodeName=":" href={href} className={cx("connection-button", "news-button", {"active": atHomeNews})}
              title={t("your-news")}>
            <FontAwesomeIcon icon="newspaper"/>
            {count != null && count > 0 && <div className="count">{count}</div>}
        </Jump>
    );
};

const connector = connect(
    (state: ClientState) => ({
        atHome: isAtHomeNode(state),
        atHomeNews: isAtHomeNode(state) && isAtNewsPage(state),
        count: getFeedNotViewed(state, ":news"),
        moment: getFeedNotViewedMoment(state, ":news"),
        atBeginning: isFeedAtBeginning(state, "news"), // not ":news"!
        targetStory: getSetting(state, "news-button.target-story") as string
    })
);

export default connector(NewsButton);

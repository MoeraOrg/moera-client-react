import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import Jump from "ui/navigation/Jump";
import { isAtHomeNode } from "state/node/selectors";
import { isAtNewsPage } from "state/navigation/selectors";
import { getFeedNotViewed } from "state/feeds/selectors";
import "./NewsButton.css";

const NewsButton = ({atHomeNews, count}) => (
    <Jump nodeName=":" href="/news" className={cx("connection-button", "news-button", {"active": atHomeNews})}
          title="Your news">
        <FontAwesomeIcon icon="newspaper"/>
        {count > 0 && <div className="count">{count}</div>}
    </Jump>
);

export default connect(
    state => ({
        atHomeNews: isAtHomeNode(state) && isAtNewsPage(state),
        count: getFeedNotViewed(state, ":news")
    })
)(NewsButton);

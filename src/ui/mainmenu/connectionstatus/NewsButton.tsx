import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import Jump from "ui/navigation/Jump";
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { isAtNewsPage } from "state/navigation/selectors";
import { getFeedNotViewed } from "state/feeds/selectors";
import "./NewsButton.css";

type Props = ConnectedProps<typeof connector>;

const NewsButton = ({atHomeNews, count}: Props) => (
    <Jump nodeName=":" href="/news" className={cx("connection-button", "news-button", {"active": atHomeNews})}
          title="Your news">
        <FontAwesomeIcon icon="newspaper"/>
        {count > 0 && <div className="count">{count}</div>}
    </Jump>
);

const connector = connect(
    (state: ClientState) => ({
        atHomeNews: isAtHomeNode(state) && isAtNewsPage(state),
        count: getFeedNotViewed(state, ":news")
    })
);

export default connector(NewsButton);

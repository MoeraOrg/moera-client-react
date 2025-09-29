import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import Jump from "ui/navigation/Jump";
import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { isAtNewsPage } from "state/navigation/selectors";
import { getFeedNotViewed } from "state/feeds/selectors";
import { useHomeNews } from "ui/feed/feeds";
import { REL_HOME } from "util/rel-node-name";
import "./NewsButton.css";

export default function NewsButton() {
    const count = useSelector((state: ClientState) => getFeedNotViewed(state, REL_HOME, "news"));
    const active = useSelector((state: ClientState) => isAtHomeNode(state) && isAtNewsPage(state));
    const href = useHomeNews();
    const {t} = useTranslation();

    return (
        <Jump nodeName={REL_HOME} href={href} className={cx("connection-button", "news-button", {"active": active})}
              title={t("your-news")}>
            <FontAwesomeIcon icon={faNewspaper}/>
            {count != null && count > 0 && <div className="count">{count}</div>}
        </Jump>
    );
}

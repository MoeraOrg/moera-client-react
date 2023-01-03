import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import Jump from "ui/navigation/Jump";
import { ClientState } from "state/state";
import { getFeedNotViewed } from "state/feeds/selectors";
import { useMainMenuHomeNews } from "ui/mainmenu/main-menu";
import "./NewsButton.css";

type Props = ConnectedProps<typeof connector>;

function NewsButton({count}: Props) {
    const {href, active} = useMainMenuHomeNews();
    const {t} = useTranslation();

    return (
        <Jump nodeName=":" href={href} className={cx("connection-button", "news-button", {"active": active})}
              title={t("your-news")}>
            <FontAwesomeIcon icon="newspaper"/>
            {count != null && count > 0 && <div className="count">{count}</div>}
        </Jump>
    );
}

const connector = connect(
    (state: ClientState) => ({
        count: getFeedNotViewed(state, ":news")
    })
);

export default connector(NewsButton);

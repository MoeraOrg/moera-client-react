import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { isAtTimelinePage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";
import "./HomeButton.css";

export default function HomeButton() {
    const atHomeTimeline = useSelector((state: ClientState) => isAtHomeNode(state) && isAtTimelinePage(state));
    const {t} = useTranslation();

    return (
        <Jump nodeName=":" href="/" className={cx("connection-button", "home-button", {"active": atHomeTimeline})}
              title={t("your-timeline")}>
            <FontAwesomeIcon icon={faHome}/>
        </Jump>
    );
}

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { isAtHomeNode } from "state/node/selectors";
import { isAtTimelinePage } from "state/navigation/selectors";
import Jump from "ui/navigation/Jump";
import "./HomeButton.css";

type Props = ConnectedProps<typeof connector>;

const HomeButton = ({atHomeTimeline}: Props) => {
    const {t} = useTranslation();

    return (
        <Jump nodeName=":" href="/" className={cx("connection-button", "home-button", {"active": atHomeTimeline})}
              title={t("your-timeline")}>
            <FontAwesomeIcon icon="home"/>
        </Jump>
    );
}

const connector = connect(
    (state: ClientState) => ({
        atHomeTimeline: isAtHomeNode(state) && isAtTimelinePage(state),
    })
);

export default connector(HomeButton);

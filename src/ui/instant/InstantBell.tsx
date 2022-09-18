import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { ClientState } from "state/state";
import { getInstantCount } from "state/feeds/selectors";
import "./InstantBell.css";

type Props = ConnectedProps<typeof connector>;

const InstantBell = ({count}: Props) => {
    const {t} = useTranslation();

    return (
        <span className="connection-button bell-button" title={t("instants")}>
            <FontAwesomeIcon icon="bell"/>{count > 0 && <div className="count">{count}</div>}
        </span>
    );
}

const connector = connect(
    (state: ClientState) => ({
        count: getInstantCount(state)
    })
);

export default connector(InstantBell);

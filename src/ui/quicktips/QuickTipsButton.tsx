import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { openQuickTips } from "state/quicktips/actions";

type Props = ConnectedProps<typeof connector>;

const QuickTipsButton = ({openQuickTips}: Props) => {
    const {t} = useTranslation();

    return (
        <span className="connection-button" title={t("help")} onClick={() => openQuickTips()}>
        <FontAwesomeIcon icon="question-circle"/>
    </span>
    );
}

const connector = connect(
    null,
    { openQuickTips }
);

export default connector(QuickTipsButton);

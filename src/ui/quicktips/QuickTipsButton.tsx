import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { openQuickTips } from "state/quicktips/actions";

type Props = ConnectedProps<typeof connector>;

const QuickTipsButton = ({openQuickTips}: Props) => (
    <span className="connection-button" title="Help" onClick={() => openQuickTips()}>
        <FontAwesomeIcon icon="question-circle"/>
    </span>
);

const connector = connect(
    null,
    { openQuickTips }
);

export default connector(QuickTipsButton);

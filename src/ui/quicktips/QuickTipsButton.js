import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { openQuickTips } from "state/quicktips/actions";

const QuickTipsButton = ({openQuickTips}) => (
    <span className="connection-button" title="Help" onClick={() => openQuickTips()}>
        <FontAwesomeIcon icon="question-circle"/>
    </span>
);

export default connect(
    null,
    { openQuickTips }
)(QuickTipsButton);

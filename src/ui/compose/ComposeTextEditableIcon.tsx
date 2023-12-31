import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import "./ComposeTextEditableIcon.css";

const ComposeTextEditableIcon = () => (
    <span className="compose-text-editable-icon"><FontAwesomeIcon icon={faPen}/></span>
);

export default ComposeTextEditableIcon;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const InstantIcon = ({story}) => {
    switch(story.storyType) {
        case "reaction-added-positive":
            return <span style={{color: "var(--correct)"}}><FontAwesomeIcon icon="thumbs-up"/></span>
        case "reaction-added-negative":
            return <span style={{color: "var(--incorrect)"}}><FontAwesomeIcon icon="thumbs-down"/></span>
        case "mention-posting":
            return <span style={{color: "var(--blue)"}}><FontAwesomeIcon icon="at"/></span>
        case "subscriber-added":
            return <span style={{color: "var(--blue)"}}><FontAwesomeIcon icon="eye"/></span>
        case "subscriber-deleted":
            return <span style={{color: "var(--blue)"}}><FontAwesomeIcon icon="eye-slash"/></span>
        default:
            return null;
    }
}

export default InstantIcon;

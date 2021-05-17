import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getInstantTypeDetails } from "ui/instant/instant-types";

export default function InstantIcon({story}) {
    const details = getInstantTypeDetails(story.storyType);
    if (details == null) {
        return null;
    }
    return <span style={{color: details.color}}><FontAwesomeIcon icon={details.icon}/></span>
}

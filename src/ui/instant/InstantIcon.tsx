import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getInstantTypeDetails } from "ui/instant/instant-types";
import { ExtStoryInfo } from "state/feeds/state";

interface Props {
    story: ExtStoryInfo;
}

export default function InstantIcon({story}: Props) {
    const details = getInstantTypeDetails(story.storyType);
    if (details?.icon == null) {
        return null;
    }
    return <span className="instant-icon" style={{color: details.color}}><FontAwesomeIcon icon={details.icon}/></span>
}

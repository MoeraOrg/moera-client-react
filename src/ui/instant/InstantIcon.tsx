import React from 'react';

import { Icon } from "ui/material-symbols";
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
    return <span className="instant-icon" style={{color: details.color}}><Icon icon={details.icon} size="1.2em"/></span>
}

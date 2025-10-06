import React from 'react';

import { FundraiserInfo } from "api";
import { Icon } from "ui/material-symbols";
import { findIcon } from "ui/donatedialog/fundraiser-util";

interface FundraiserIconProps {
    fundraiser: FundraiserInfo;
}

export default function FundraiserIcon({fundraiser}: FundraiserIconProps) {
    const icon = findIcon(fundraiser);
    if (icon == null) {
        return null;
    }
    return <Icon icon={icon.icon} size="1.2em" className="me-2"/>;
}

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FundraiserInfo } from "api/node/api-types";
import { findIcon } from "ui/donatedialog/fundraiser-util";

interface FundraiserIconProps {
    fundraiser: FundraiserInfo;
}

export default function FundraiserIcon({fundraiser}: FundraiserIconProps) {
    const icon = findIcon(fundraiser);
    if (icon == null) {
        return null;
    }
    return <FontAwesomeIcon icon={icon.icon} className="me-2"/>;
}

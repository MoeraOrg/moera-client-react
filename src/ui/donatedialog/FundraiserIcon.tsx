import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FundraiserInfo } from "api/node/api-types";
import { hasSchemeOrDomain } from "util/url";

interface FundraiserIconInfo {
    prefix: string;
    icon: IconProp;
    color?: string;
}

const FUNDRAISER_ICONS: FundraiserIconInfo[] = [
    {
        prefix: "bitcoin:",
        icon: ["fab", "bitcoin"]
    },
    {
        prefix: "lightning:",
        icon: "bolt"
    },
    {
        prefix: "ethereum:",
        icon: ["fab", "ethereum"]
    },
    {
        prefix: "patreon.com",
        icon: ["fab", "patreon"]
    },
    {
        prefix: "paypal.com",
        icon: ["fab", "paypal"]
    },
    {
        prefix: "paypal.me",
        icon: ["fab", "paypal"]
    }
];

interface FundraiserIconProps {
    fundraiser: FundraiserInfo;
}

function findIcon(href: string | null | undefined): FundraiserIconInfo | null {
    if (!href) {
        return null;
    }
    const icon = FUNDRAISER_ICONS.find(info => hasSchemeOrDomain(href, info.prefix));
    return icon ?? null;
}

export default function FundraiserIcon({fundraiser}: FundraiserIconProps) {
    const icon = findIcon(fundraiser.href) ?? findIcon(fundraiser.qrCode);
    if (icon == null) {
        return null;
    }
    return <FontAwesomeIcon icon={icon.icon} className="me-2"/>;
}

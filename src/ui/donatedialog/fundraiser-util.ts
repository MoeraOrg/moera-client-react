import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { faBitcoin, faEthereum, faPatreon, faPaypal } from '@fortawesome/free-brands-svg-icons';

import { FundraiserInfo } from "api";
import { hasSchemeOrDomain } from "util/url";

const BITCOIN_ADDRESS = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
const LIGHTNING_ADDRESS = /^LNURL1[AC-HJ-NP-Z02-9]{6,}$/;

interface FundraiserIconInfo {
    prefix: string;
    icon: IconProp;
    color?: string;
}

const FUNDRAISER_ICONS: FundraiserIconInfo[] = [
    {
        prefix: "bitcoin:",
        icon: faBitcoin
    },
    {
        prefix: "lightning:",
        icon: faBolt
    },
    {
        prefix: "ethereum:",
        icon: faEthereum
    },
    {
        prefix: "patreon.com",
        icon: faPatreon
    },
    {
        prefix: "paypal.com",
        icon: faPaypal
    },
    {
        prefix: "paypal.me",
        icon: faPaypal
    }
];

export function getFundraiserAutoHref(fundraiser: FundraiserInfo): string | undefined {
    const {href, qrCode} = fundraiser;

    if (href) {
        return href;
    }
    if (!qrCode) {
        return undefined;
    }
    if (qrCode.startsWith("http:") || qrCode.startsWith("https:") || qrCode.startsWith("bitcoin:")
        || qrCode.startsWith("lightning:")) {
        return qrCode;
    }
    if (qrCode.match(BITCOIN_ADDRESS)) {
        return "bitcoin:" + qrCode;
    }
    if (qrCode.match(LIGHTNING_ADDRESS)) {
        return "lightning:" + qrCode;
    }
    return undefined;
}

function findIconByHref(href: string | null | undefined): FundraiserIconInfo | null {
    if (!href) {
        return null;
    }
    const icon = FUNDRAISER_ICONS.find(info => hasSchemeOrDomain(href, info.prefix));
    return icon ?? null;
}

export function findIcon(fundraiser: FundraiserInfo): FundraiserIconInfo | null {
    return findIconByHref(getFundraiserAutoHref(fundraiser)) ?? findIconByHref(fundraiser.qrCode);
}

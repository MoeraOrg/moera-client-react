import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { FundraiserInfo } from "api";
import { openDonateDialog } from "state/donatedialog/actions";
import { Button, usePopover } from "ui/control";
import { Browser } from "ui/browser";

interface Props {
    name: string | null;
    fullName: string | null;
    fundraisers: FundraiserInfo[] | null;
    styles?: "large" | "small" | "icon";
    className?: string;
}

export function DonateButton({name, fullName, fundraisers, styles = "large", className}: Props) {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const {hide: hidePopover} = usePopover();

    if (name == null || fundraisers == null || fundraisers.length === 0) {
        return null;
    }

    if (Browser.isAndroidGooglePlay()) {
        return null;
    }

    const onClick = () => {
        hidePopover();
        dispatch(openDonateDialog(name, fullName, fundraisers));
    };

    return (
        <Button variant="outline-success"
                size={styles === "small" ? "sm" : undefined}
                title={styles === "icon" ? t("donate") : undefined}
                className={cx(className, {"border-0": styles === "icon"})}
                onClick={onClick}>
            <FontAwesomeIcon icon="hand-holding-heart"/>
            {styles !== "icon" ? " " + t("donate") : ""}
        </Button>
    );
}

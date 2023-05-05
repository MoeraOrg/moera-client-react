import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { FundraiserInfo } from "api/node/api-types";
import { openDonateDialog } from "state/donatedialog/actions";
import { Button } from "ui/control";
import { Browser } from "ui/browser";

type Props = {
    name: string | null;
    fullName: string | null;
    fundraisers: FundraiserInfo[] | null;
    styles?: "large" | "small" | "icon";
    className?: string;
} & ConnectedProps<typeof connector>;

const DonateButtonImpl = ({name, fullName, fundraisers, styles = "large", className, openDonateDialog}: Props) => {
    const {t} = useTranslation();

    if (name == null || fundraisers == null || fundraisers.length === 0) {
        return null;
    }

    if (Browser.isAndroidGooglePlay()) {
        return null;
    }

    const onClick = () => {
        document.dispatchEvent(new Event("hidepopper"));
        openDonateDialog(name, fullName, fundraisers);
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

const connector = connect(
    null,
    { openDonateDialog }
);

export const DonateButton = connector(DonateButtonImpl);

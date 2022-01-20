import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

import { FundraiserInfo } from "api/node/api-types";
import { openDonateDialog } from "state/donatedialog/actions";
import { Button } from "ui/control";

type Props = {
    name: string | null;
    fullName: string | null;
    fundraisers: FundraiserInfo[] | null;
    styles?: "large" | "small" | "icon";
    className?: string;
} & ConnectedProps<typeof connector>;

const DonateButtonImpl = ({name, fullName, fundraisers, styles = "large", className, openDonateDialog}: Props) => {
    if (name == null || fundraisers == null || fundraisers.length === 0) {
        return null;
    }

    return (
        <Button variant="outline-success"
                size={styles === "small" ? "sm" : undefined}
                title={styles === "icon" ? "Donate" : undefined}
                className={cx(className, {"border-0": styles === "icon"})}
                onClick={() => openDonateDialog(name, fullName, fundraisers)}>
            <FontAwesomeIcon icon="hand-holding-heart"/>
            {styles !== "icon" ? " Donate" : ""}
        </Button>
    );
}

const connector = connect(
    null,
    { openDonateDialog }
);

export const DonateButton = connector(DonateButtonImpl);

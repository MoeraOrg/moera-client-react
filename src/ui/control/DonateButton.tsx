import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FundraiserInfo } from "api/node/api-types";
import { openDonateDialog } from "state/donatedialog/actions";
import { Button } from "ui/control";

type Props = {
    name: string;
    fullName: string | null;
    fundraisers: FundraiserInfo[];
} & ConnectedProps<typeof connector>;

const DonateButtonImpl = ({name, fullName, fundraisers, openDonateDialog}: Props) => (
    <Button variant="outline-success" onClick={() => openDonateDialog(name, fullName, fundraisers)}>
        <FontAwesomeIcon icon="hand-holding-heart"/>
        {" "}Donate
    </Button>
);

const connector = connect(
    null,
    { openDonateDialog }
);

export const DonateButton = connector(DonateButtonImpl);
